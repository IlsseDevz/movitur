package com.movitur.dto;

import com.movitur.entity.Avaliacao;

import java.time.LocalDateTime;

public class AvaliacaoResponse {

    private Long id;
    private Long guiaId;
    private String guiaNome;
    private Long reservaId;
    private String usuarioNome;
    private Integer nota;
    private String comentario;
    private LocalDateTime criadoEm;

    public static AvaliacaoResponse fromEntity(Avaliacao a) {
        AvaliacaoResponse res = new AvaliacaoResponse();
        res.id = a.getId();
        res.guiaId = a.getGuia().getId();
        res.guiaNome = a.getGuia().getNome();
        res.reservaId = a.getReserva().getId();
        res.usuarioNome = a.getUsuario().getNomeCompleto();
        res.nota = a.getNota();
        res.comentario = a.getComentario();
        res.criadoEm = a.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public Long getGuiaId() {
        return guiaId;
    }

    public String getGuiaNome() {
        return guiaNome;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public Integer getNota() {
        return nota;
    }

    public String getComentario() {
        return comentario;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
