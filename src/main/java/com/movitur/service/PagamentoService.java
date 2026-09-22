package com.movitur.service;

import com.movitur.dto.PagamentoRequest;
import com.movitur.dto.email.PagamentoEmailData;
import com.movitur.dto.PagamentoResponse;
import com.movitur.entity.MetaPoupanca;
import com.movitur.entity.MetodoPagamento;
import com.movitur.entity.Pagamento;
import com.movitur.entity.Reserva;
import com.movitur.entity.Role;
import com.movitur.entity.StatusPagamento;
import com.movitur.entity.StatusReserva;
import com.movitur.entity.StatusVerificacaoPagamento;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.PagamentoRepository;
import com.movitur.repository.ReservaRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final ReservaRepository reservaRepository;
    private final MetaPoupancaService metaPoupancaService;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final NotificacaoService notificacaoService;

    public PagamentoService(
            PagamentoRepository pagamentoRepository,
            ReservaRepository reservaRepository,
            MetaPoupancaService metaPoupancaService,
            UsuarioRepository usuarioRepository,
            EmailService emailService,
            NotificacaoService notificacaoService) {
        this.pagamentoRepository = pagamentoRepository;
        this.reservaRepository = reservaRepository;
        this.metaPoupancaService = metaPoupancaService;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.notificacaoService = notificacaoService;
    }

    public PagamentoResponse pagar(PagamentoRequest request) {
        Usuario cliente = getClienteAtual();
        Reserva reserva = reservaRepository.findByIdAndUsuarioId(request.getReservaId(), cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva nao encontrada."));

        if (reserva.getStatus() != StatusReserva.CONFIRMADA) {
            throw new RegraNegocioException("Apenas reservas confirmadas podem ser pagas.");
        }
        if (reserva.getStatusPagamento() == StatusPagamento.PAGO) {
            throw new RegraNegocioException("Esta reserva ja esta totalmente paga.");
        }

        double restante = calcularRestante(reserva);
        if (request.getValor() > restante) {
            throw new RegraNegocioException("O valor excede o montante em falta (" + String.format("%.2f MZN", restante) + ").");
        }

        MetaPoupanca meta = null;
        boolean confirmacaoImediata = false;

        if (request.getMetodo() == MetodoPagamento.POUPANCA) {
            if (request.getMetaPoupancaId() == null) {
                throw new RegraNegocioException("Selecione a meta de poupanca para pagar.");
            }
            meta = metaPoupancaService.buscarMetaDoCliente(request.getMetaPoupancaId());
            double saldo = metaPoupancaService.calcularSaldo(meta);
            if (saldo < request.getValor()) {
                throw new RegraNegocioException("Saldo insuficiente na poupanca. Disponivel: " + String.format("%.2f MZN", saldo));
            }
            confirmacaoImediata = true;
        } else if (!StringUtils.hasText(request.getReferencia())) {
            throw new RegraNegocioException("Informe a referencia do pagamento (ex: codigo M-Pesa).");
        }

        Pagamento pagamento = new Pagamento();
        pagamento.setReserva(reserva);
        pagamento.setUsuario(cliente);
        pagamento.setValor(request.getValor());
        pagamento.setMetodo(request.getMetodo());
        pagamento.setReferencia(request.getReferencia());
        pagamento.setMetaPoupanca(meta);
        pagamento.setStatusVerificacao(confirmacaoImediata
                ? StatusVerificacaoPagamento.CONFIRMADO
                : StatusVerificacaoPagamento.PENDENTE);

        Pagamento guardado = pagamentoRepository.save(pagamento);

        if (confirmacaoImediata) {
            recalcularEstadoPagamentoReserva(reserva);
            emailService.enviarEmailPagamentoConfirmado(PagamentoEmailData.from(guardado));
            notificacaoService.enviar(
                    cliente,
                    "Pagamento confirmado",
                    "Pagamento de " + String.format("%.2f MZN", guardado.getValor()) + " via poupanca confirmado.",
                    "/cliente/reservas");
        } else {
            PagamentoEmailData emailData = PagamentoEmailData.from(guardado);
            emailService.enviarEmailPagamentoPendente(emailData);
            emailService.enviarEmailPagamentoPendenteAdmin(emailData);
            notificacaoService.enviarParaAdmins(
                    "Pagamento a verificar",
                    cliente.getNomeCompleto() + " submeteu pagamento de "
                            + String.format("%.2f MZN", guardado.getValor()) + " ("
                            + guardado.getMetodo().name() + ").",
                    "/admin/pagamentos");
            notificacaoService.enviar(
                    cliente,
                    "Pagamento em analise",
                    "O seu pagamento de " + String.format("%.2f MZN", guardado.getValor()) + " aguarda verificacao.",
                    "/cliente/reservas");
        }

        return PagamentoResponse.fromEntity(guardado);
    }

    public PagamentoResponse confirmarAdmin(Long id) {
        Pagamento pagamento = buscarPagamento(id);
        if (pagamento.getStatusVerificacao() != StatusVerificacaoPagamento.PENDENTE) {
            throw new RegraNegocioException("Apenas pagamentos pendentes podem ser confirmados.");
        }

        Reserva reserva = pagamento.getReserva();
        double restante = calcularRestante(reserva);
        if (pagamento.getValor() > restante) {
            throw new RegraNegocioException("O valor excede o montante em falta na reserva.");
        }

        pagamento.setStatusVerificacao(StatusVerificacaoPagamento.CONFIRMADO);
        pagamentoRepository.save(pagamento);
        recalcularEstadoPagamentoReserva(reserva);
        emailService.enviarEmailPagamentoConfirmado(PagamentoEmailData.from(pagamento));
        notificacaoService.enviar(
                pagamento.getUsuario(),
                "Pagamento confirmado",
                "O pagamento de " + String.format("%.2f MZN", pagamento.getValor()) + " foi confirmado.",
                "/cliente/reservas");

        return PagamentoResponse.fromEntity(pagamento);
    }

    public PagamentoResponse rejeitarAdmin(Long id, String motivo) {
        Pagamento pagamento = buscarPagamento(id);
        if (pagamento.getStatusVerificacao() != StatusVerificacaoPagamento.PENDENTE) {
            throw new RegraNegocioException("Apenas pagamentos pendentes podem ser rejeitados.");
        }

        pagamento.setStatusVerificacao(StatusVerificacaoPagamento.REJEITADO);
        pagamento.setMotivoRejeicao(StringUtils.hasText(motivo) ? motivo.trim() : null);
        pagamentoRepository.save(pagamento);
        emailService.enviarEmailPagamentoRejeitado(PagamentoEmailData.from(pagamento));
        notificacaoService.enviar(
                pagamento.getUsuario(),
                "Pagamento rejeitado",
                "O pagamento de " + String.format("%.2f MZN", pagamento.getValor()) + " nao foi confirmado.",
                "/cliente/reservas");

        return PagamentoResponse.fromEntity(pagamento);
    }

    @Transactional(readOnly = true)
    public List<PagamentoResponse> listarMinhas() {
        return pagamentoRepository.findByUsuarioIdOrderByCriadoEmDesc(getClienteAtual().getId())
                .stream()
                .map(PagamentoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PagamentoResponse> listarPorReserva(Long reservaId) {
        Reserva reserva = reservaRepository.findByIdAndUsuarioId(reservaId, getClienteAtual().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva nao encontrada."));
        return pagamentoRepository.findByReservaIdOrderByCriadoEmDesc(reserva.getId())
                .stream()
                .map(PagamentoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PagamentoResponse> listarTodosAdmin(StatusVerificacaoPagamento status) {
        List<Pagamento> pagamentos = status != null
                ? pagamentoRepository.findByStatusVerificacaoOrderByCriadoEmDesc(status)
                : pagamentoRepository.findAllByOrderByCriadoEmDesc();
        return pagamentos.stream().map(PagamentoResponse::fromEntity).toList();
    }

    private Pagamento buscarPagamento(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento nao encontrado."));
    }

    private double calcularRestante(Reserva reserva) {
        double confirmado = pagamentoRepository.somarConfirmadosPorReserva(reserva.getId());
        return Math.max(0, reserva.getPrecoEstimado() - confirmado);
    }

    private void recalcularEstadoPagamentoReserva(Reserva reserva) {
        double totalConfirmado = pagamentoRepository.somarConfirmadosPorReserva(reserva.getId());
        reserva.setValorPago(totalConfirmado);
        if (totalConfirmado >= reserva.getPrecoEstimado()) {
            reserva.setStatusPagamento(StatusPagamento.PAGO);
        } else if (totalConfirmado > 0) {
            reserva.setStatusPagamento(StatusPagamento.PARCIAL);
        } else {
            reserva.setStatusPagamento(StatusPagamento.NAO_PAGO);
        }
        reservaRepository.save(reserva);
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem efetuar pagamentos.");
        }
        return usuario;
    }
}
