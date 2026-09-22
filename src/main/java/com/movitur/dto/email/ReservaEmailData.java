package com.movitur.dto.email;

import com.movitur.entity.Reserva;

import java.time.format.DateTimeFormatter;

public record ReservaEmailData(
        Long id,
        String clienteNome,
        String clienteEmail,
        String destinoNome,
        String destinoCidade,
        String dataInicio,
        int numeroDias,
        int numeroPessoas,
        Double precoEstimado,
        String guiaNome
) {
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static ReservaEmailData from(Reserva reserva) {
        return new ReservaEmailData(
                reserva.getId(),
                reserva.getUsuario().getNomeCompleto(),
                reserva.getUsuario().getEmail(),
                reserva.getDestino().getNome(),
                reserva.getDestino().getCidade(),
                reserva.getDataInicio().format(DATA),
                reserva.getNumeroDias(),
                reserva.getNumeroPessoas(),
                reserva.getPrecoEstimado(),
                reserva.getGuia() != null ? reserva.getGuia().getNome() : null
        );
    }
}
