package com.movitur.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AvaliacaoRequest {

    @NotNull(message = "O id da reserva e obrigatorio.")
    private Long reservaId;

    @NotNull(message = "A nota e obrigatoria.")
    @Min(value = 1, message = "A nota minima e 1.")
    @Max(value = 5, message = "A nota maxima e 5.")
    private Integer nota;

    @Size(max = 1000, message = "O comentario nao pode exceder 1000 caracteres.")
    private String comentario;

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
