package com.movitur.dto;

import com.movitur.entity.Favorito;

import java.time.LocalDateTime;

public class FavoritoResponse {

    private Long id;
    private String tipo;
    private Long itemId;
    private String nome;
    private String subtitulo;
    private String imagemUrl;
    private LocalDateTime criadoEm;

    public static FavoritoResponse of(Favorito favorito, String nome, String subtitulo, String imagemUrl) {
        FavoritoResponse res = new FavoritoResponse();
        res.id = favorito.getId();
        res.tipo = favorito.getTipo().name();
        res.itemId = favorito.getItemId();
        res.nome = nome;
        res.subtitulo = subtitulo;
        res.imagemUrl = imagemUrl;
        res.criadoEm = favorito.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public Long getItemId() {
        return itemId;
    }

    public String getNome() {
        return nome;
    }

    public String getSubtitulo() {
        return subtitulo;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
