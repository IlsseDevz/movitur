package com.movitur.dto;

import com.movitur.entity.Feedback;
import com.movitur.entity.TipoFeedbackAlvo;

import java.time.LocalDateTime;

public class FeedbackResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private TipoFeedbackAlvo tipoAlvo;
    private Long entidadeId;
    private String entidadeNome;
    private Integer estrelas;
    private String comentario;
    private LocalDateTime criadoEm;

    public static FeedbackResponse fromEntity(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.id = feedback.getId();
        response.usuarioId = feedback.getUsuario().getId();
        response.usuarioNome = feedback.getUsuario().getNomeCompleto();
        response.tipoAlvo = feedback.getTipoAlvo();
        response.entidadeId = feedback.getEntidadeId();
        response.entidadeNome = feedback.getEntidadeNome();
        response.estrelas = feedback.getEstrelas();
        response.comentario = feedback.getComentario();
        response.criadoEm = feedback.getCriadoEm();
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

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

    public String getEntidadeNome() {
        return entidadeNome;
    }

    public void setEntidadeNome(String entidadeNome) {
        this.entidadeNome = entidadeNome;
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

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
