package com.movitur.service;

import com.movitur.dto.DestinoReservaResumo;
import com.movitur.dto.RelatorioResumoResponse;
import com.movitur.entity.Pagamento;
import com.movitur.entity.Reserva;
import com.movitur.entity.Role;
import com.movitur.entity.StatusReserva;
import com.movitur.entity.StatusVerificacaoPagamento;
import com.movitur.repository.PagamentoRepository;
import com.movitur.repository.ReservaRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RelatorioAdminService {

    private final ReservaRepository reservaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final UsuarioRepository usuarioRepository;

    public RelatorioAdminService(
            ReservaRepository reservaRepository,
            PagamentoRepository pagamentoRepository,
            UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public RelatorioResumoResponse resumo() {
        RelatorioResumoResponse res = new RelatorioResumoResponse();
        res.setTotalClientes(usuarioRepository.countByRole(Role.CLIENTE));
        res.setReservasPendentes(reservaRepository.countByStatus(StatusReserva.PENDENTE));
        res.setReservasConfirmadas(reservaRepository.countByStatus(StatusReserva.CONFIRMADA));
        res.setReservasCanceladas(reservaRepository.countByStatus(StatusReserva.CANCELADA));
        res.setReservasRejeitadas(reservaRepository.countByStatus(StatusReserva.REJEITADA));
        res.setReceitaConfirmada(pagamentoRepository.somarPorStatus(StatusVerificacaoPagamento.CONFIRMADO));
        res.setPagamentosPendentes(pagamentoRepository.countByStatusVerificacao(StatusVerificacaoPagamento.PENDENTE));
        res.setValorReservasConfirmadas(reservaRepository.somarPrecoReservasConfirmadas());

        List<DestinoReservaResumo> top = reservaRepository.contarReservasPorDestino().stream()
                .limit(5)
                .map(row -> new DestinoReservaResumo(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2]))
                .collect(Collectors.toList());
        res.setTopDestinos(top);
        return res;
    }

    public byte[] exportarReservasCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Cliente,Email,Destino,Data Inicio,Dias,Pessoas,Preco Estimado,Valor Pago,Estado Reserva,Estado Pagamento,Criado Em\n");
        for (Reserva r : reservaRepository.findAllByOrderByCriadoEmDesc()) {
            sb.append(r.getId()).append(',');
            sb.append(csv(r.getUsuario().getNomeCompleto())).append(',');
            sb.append(csv(r.getUsuario().getEmail())).append(',');
            sb.append(csv(r.getDestino().getNome())).append(',');
            sb.append(r.getDataInicio()).append(',');
            sb.append(r.getNumeroDias()).append(',');
            sb.append(r.getNumeroPessoas()).append(',');
            sb.append(r.getPrecoEstimado()).append(',');
            sb.append(r.getValorPago()).append(',');
            sb.append(r.getStatus()).append(',');
            sb.append(r.getStatusPagamento()).append(',');
            sb.append(r.getCriadoEm()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportarPagamentosCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Cliente,Email,Destino,Valor,Metodo,Referencia,Estado Verificacao,Motivo Rejeicao,Criado Em\n");
        for (Pagamento p : pagamentoRepository.findAllByOrderByCriadoEmDesc()) {
            sb.append(p.getId()).append(',');
            sb.append(csv(p.getUsuario().getNomeCompleto())).append(',');
            sb.append(csv(p.getUsuario().getEmail())).append(',');
            sb.append(csv(p.getReserva().getDestino().getNome())).append(',');
            sb.append(p.getValor()).append(',');
            sb.append(p.getMetodo()).append(',');
            sb.append(csv(p.getReferencia())).append(',');
            sb.append(p.getStatusVerificacao()).append(',');
            sb.append(csv(p.getMotivoRejeicao())).append(',');
            sb.append(p.getCriadoEm()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }
}
