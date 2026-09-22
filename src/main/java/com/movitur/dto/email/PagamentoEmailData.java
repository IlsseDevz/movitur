package com.movitur.dto.email;

import com.movitur.entity.MetodoPagamento;
import com.movitur.entity.Pagamento;
import com.movitur.entity.StatusPagamento;

public record PagamentoEmailData(
        Long id,
        String clienteNome,
        String clienteEmail,
        String destinoNome,
        double valor,
        String metodo,
        String referencia,
        String motivoRejeicao,
        Double totalPago,
        Double precoEstimado,
        String statusPagamento
) {
    public static PagamentoEmailData from(Pagamento pagamento) {
        var reserva = pagamento.getReserva();
        return new PagamentoEmailData(
                pagamento.getId(),
                pagamento.getUsuario().getNomeCompleto(),
                pagamento.getUsuario().getEmail(),
                reserva.getDestino().getNome(),
                pagamento.getValor(),
                labelMetodo(pagamento.getMetodo()),
                pagamento.getReferencia(),
                pagamento.getMotivoRejeicao(),
                reserva.getValorPago(),
                reserva.getPrecoEstimado(),
                labelStatusPagamento(reserva.getStatusPagamento())
        );
    }

    private static String labelMetodo(MetodoPagamento metodo) {
        return switch (metodo) {
            case MPESA -> "M-Pesa";
            case TRANSFERENCIA -> "Transferencia bancaria";
            case POUPANCA -> "Poupanca MoviTur";
        };
    }

    private static String labelStatusPagamento(StatusPagamento status) {
        if (status == null) {
            return "Nao pago";
        }
        return switch (status) {
            case NAO_PAGO -> "Nao pago";
            case PARCIAL -> "Parcialmente pago";
            case PAGO -> "Pago";
        };
    }
}
