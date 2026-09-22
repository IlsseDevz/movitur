package com.movitur.dto;

import com.movitur.entity.TipoFeedbackAlvo;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FeedbackRequest {

    @NotNull(message = "O tipo de item e obrigatorio")
    private TipoFeedbackAlvo tipoAlvo;

    @NotNull(message = "O item a avaliar e obrigatorio")
    private Long entidadeId;

    @NotNull(message = "A classificacao em estrelas e obrigatoria")
    @Min(value = 1, message = "A classificacao minima e 1 estrela")
    @Max(value = 5, message = "A classificacao maxima e 5 estrelas")
    private Integer estrelas;

    @NotBlank(message = "O comentario e obrigatorio")
    @Size(max = 2000, message = "O comentario deve ter no maximo 2000 caracteres")
    private String comentario;

    public TipoFeedbackAlvo getTipoAlvo() {
        return tipoAlvo;
    }

    public void setTipoAlvo(TipoFeedbackAlvo tipoAlvo) {
        this.tipoAlvo = tipoAlvo;
    }

    public Long getEntidadeId() {
        return entidadeId;
    }

    public void setEntidadeId(Long entidadeId) {
        this.entidadeId = entidadeId;
    }

    public Integer getEstrelas() {
        return estrelas;
    }

    public void setEstrelas(Integer estrelas) {
        this.estrelas = estrelas;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
