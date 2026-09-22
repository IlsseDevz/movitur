package com.movitur.dto;

import com.movitur.entity.Notificacao;

import java.time.LocalDateTime;

public class NotificacaoResponse {

    private Long id;
    private String titulo;
    private String mensagem;
    private String link;
    private boolean lida;
    private LocalDateTime criadoEm;

    public static NotificacaoResponse fromEntity(Notificacao n) {
        NotificacaoResponse res = new NotificacaoResponse();
        res.id = n.getId();
        res.titulo = n.getTitulo();
        res.mensagem = n.getMensagem();
        res.link = n.getLink();
        res.lida = n.isLida();
        res.criadoEm = n.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public String getLink() {
        return link;
    }

    public boolean isLida() {
        return lida;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
