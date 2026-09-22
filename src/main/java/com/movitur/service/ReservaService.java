package com.movitur.service;

import com.movitur.dto.ReservaRequest;
import com.movitur.dto.email.ReservaEmailData;
import com.movitur.dto.ReservaResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.GuiaTuristico;
import com.movitur.entity.Reserva;
import com.movitur.entity.Role;
import com.movitur.entity.StatusReserva;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.AvaliacaoRepository;
import com.movitur.repository.ReservaRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final DestinoService destinoService;
    private final GuiaTuristicoService guiaTuristicoService;
    private final UsuarioRepository usuarioRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final EmailService emailService;
    private final NotificacaoService notificacaoService;

    public ReservaService(
            ReservaRepository reservaRepository,
            DestinoService destinoService,
            GuiaTuristicoService guiaTuristicoService,
            UsuarioRepository usuarioRepository,
            AvaliacaoRepository avaliacaoRepository,
            EmailService emailService,
            NotificacaoService notificacaoService) {
        this.reservaRepository = reservaRepository;
        this.destinoService = destinoService;
        this.guiaTuristicoService = guiaTuristicoService;
        this.usuarioRepository = usuarioRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.emailService = emailService;
        this.notificacaoService = notificacaoService;
    }

    public ReservaResponse criar(ReservaRequest request) {
        Usuario cliente = getClienteAtual();
        Destino destino = destinoService.buscarEntidade(request.getDestinoId());
        if (!destino.isAtivo()) {
            throw new RegraNegocioException("O destino selecionado nao esta disponivel.");
        }

        GuiaTuristico guia = null;
        if (request.getGuiaId() != null) {
            guia = guiaTuristicoService.buscarEntidade(request.getGuiaId());
            if (!guia.isAtivo()) {
                throw new RegraNegocioException("O guia selecionado nao esta disponivel.");
            }
            boolean guiaAtendeDestino = guia.getDestinos().stream()
                    .anyMatch(d -> d.getId().equals(destino.getId()));
            if (!guiaAtendeDestino) {
                throw new RegraNegocioException("O guia selecionado nao atende este destino.");
            }
            validarDisponibilidadeGuia(guia.getId(), request.getDataInicio(), request.getNumeroDias());
        }

        double precoDia = destino.getPrecoMedioEstimado() != null
                ? destino.getPrecoMedioEstimado().doubleValue() : 0.0;
        double precoEstimado = precoDia * request.getNumeroDias() * request.getNumeroPessoas();

        Reserva reserva = new Reserva();
        reserva.setUsuario(cliente);
        reserva.setDestino(destino);
        reserva.setGuia(guia);
        reserva.setDataInicio(request.getDataInicio());
        reserva.setNumeroDias(request.getNumeroDias());
        reserva.setNumeroPessoas(request.getNumeroPessoas());
        reserva.setObservacoes(request.getObservacoes());
        reserva.setPrecoEstimado(precoEstimado);
        reserva.setStatus(StatusReserva.PENDENTE);

        Reserva guardada = reservaRepository.save(reserva);
        ReservaEmailData emailData = ReservaEmailData.from(guardada);
        emailService.enviarEmailNovaReservaCliente(emailData);
        emailService.enviarEmailNovaReservaAdmin(emailData);
        notificacaoService.enviarParaAdmins(
                "Nova reserva pendente",
                cliente.getNomeCompleto() + " pediu reserva para " + destino.getNome() + ".",
                "/admin/reservas");
        return toResponse(guardada);
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listarMinhas() {
        Long usuarioId = getClienteAtual().getId();
        return reservaRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream()
                .map(r -> toResponse(r))
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservaResponse buscarMinha(Long id) {
        return toResponse(buscarEntidadeDoCliente(id));
    }

    public ReservaResponse cancelar(Long id) {
        Reserva reserva = buscarEntidadeDoCliente(id);
        if (reserva.getStatus() != StatusReserva.PENDENTE) {
            throw new RegraNegocioException("Apenas reservas pendentes podem ser canceladas pelo cliente.");
        }
        reserva.setStatus(StatusReserva.CANCELADA);
        Reserva guardada = reservaRepository.save(reserva);
        emailService.enviarEmailReservaCancelada(ReservaEmailData.from(guardada));
        return ReservaResponse.fromEntity(guardada);
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listarTodas(StatusReserva status) {
        List<Reserva> reservas = (status == null)
                ? reservaRepository.findAllByOrderByCriadoEmDesc()
                : reservaRepository.findByStatusOrderByCriadoEmDesc(status);
        return reservas.stream().map(ReservaResponse::fromEntity).toList();
    }

    public ReservaResponse confirmar(Long id) {
        Reserva reserva = buscarEntidade(id);
        if (reserva.getStatus() != StatusReserva.PENDENTE) {
            throw new RegraNegocioException("Apenas reservas pendentes podem ser confirmadas.");
        }
        reserva.setStatus(StatusReserva.CONFIRMADA);
        Reserva guardada = reservaRepository.save(reserva);
        emailService.enviarEmailReservaConfirmada(ReservaEmailData.from(guardada));
        notificacaoService.enviar(
                guardada.getUsuario(),
                "Reserva confirmada",
                "A sua reserva para " + guardada.getDestino().getNome() + " foi confirmada.",
                "/cliente/reservas");
        return ReservaResponse.fromEntity(guardada);
    }

    public ReservaResponse rejeitar(Long id) {
        Reserva reserva = buscarEntidade(id);
        if (reserva.getStatus() != StatusReserva.PENDENTE) {
            throw new RegraNegocioException("Apenas reservas pendentes podem ser rejeitadas.");
        }
        reserva.setStatus(StatusReserva.REJEITADA);
        Reserva guardada = reservaRepository.save(reserva);
        emailService.enviarEmailReservaRejeitada(ReservaEmailData.from(guardada));
        notificacaoService.enviar(
                guardada.getUsuario(),
                "Reserva rejeitada",
                "A reserva para " + guardada.getDestino().getNome() + " foi rejeitada.",
                "/cliente/reservas");
        return ReservaResponse.fromEntity(guardada);
    }

    public ReservaResponse cancelarAdmin(Long id) {
        Reserva reserva = buscarEntidade(id);
        if (reserva.getStatus() == StatusReserva.CANCELADA || reserva.getStatus() == StatusReserva.REJEITADA) {
            throw new RegraNegocioException("Esta reserva ja foi cancelada ou rejeitada.");
        }
        reserva.setStatus(StatusReserva.CANCELADA);
        Reserva guardada = reservaRepository.save(reserva);
        emailService.enviarEmailReservaCancelada(ReservaEmailData.from(guardada));
        notificacaoService.enviar(
                guardada.getUsuario(),
                "Reserva cancelada",
                "A reserva para " + guardada.getDestino().getNome() + " foi cancelada.",
                "/cliente/reservas");
        return ReservaResponse.fromEntity(guardada);
    }

    @Transactional(readOnly = true)
    public long contarPendentes() {
        return reservaRepository.countByStatus(StatusReserva.PENDENTE);
    }

    private void validarDisponibilidadeGuia(Long guiaId, LocalDate inicio, Integer numeroDias) {
        LocalDate fim = inicio.plusDays(numeroDias - 1L);
        List<Reserva> existentes = reservaRepository.findByGuiaIdAndStatusIn(
                guiaId, List.of(StatusReserva.PENDENTE, StatusReserva.CONFIRMADA));

        for (Reserva r : existentes) {
            LocalDate rInicio = r.getDataInicio();
            LocalDate rFim = rInicio.plusDays(r.getNumeroDias() - 1L);
            if (!inicio.isAfter(rFim) && !fim.isBefore(rInicio)) {
                throw new RegraNegocioException("O guia nao esta disponivel nas datas selecionadas.");
            }
        }
    }

    private ReservaResponse toResponse(Reserva reserva) {
        boolean avaliada = avaliacaoRepository.existsByReservaId(reserva.getId());
        return ReservaResponse.fromEntity(reserva, avaliada);
    }

    private Reserva buscarEntidadeDoCliente(Long id) {
        return reservaRepository.findByIdAndUsuarioId(id, getClienteAtual().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva nao encontrada com id: " + id));
    }

    private Reserva buscarEntidade(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva nao encontrada com id: " + id));
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado: " + auth.getName()));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem efetuar reservas.");
        }
        return usuario;
    }
}
