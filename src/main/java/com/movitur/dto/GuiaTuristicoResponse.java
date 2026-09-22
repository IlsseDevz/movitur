package com.movitur.dto;

import java.util.Set;

public class GuiaTuristicoResponse {

    private Long id;
    private String nome;
    private String biografia;
    private Integer anosExperiencia;
    private String fotoUrl;
    private Double avaliacaoMedia;
    private boolean ativo;
    private Set<Long> destinoIds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public Integer getAnosExperiencia() {
        return anosExperiencia;
    }

    public void setAnosExperiencia(Integer anosExperiencia) {
        this.anosExperiencia = anosExperiencia;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(Double avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Set<Long> getDestinoIds() {
        return destinoIds;
    }

    public void setDestinoIds(Set<Long> destinoIds) {
        this.destinoIds = destinoIds;
    }
}
