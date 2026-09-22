package com.movitur.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "guias_turisticos")
public class GuiaTuristico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Column(length = 2000)
    private String biografia;

    @Column(nullable = false)
    private Integer anosExperiencia;

    @Column(length = 500)
    private String fotoUrl;

    @Column(nullable = false)
    private Double avaliacaoMedia = 0.0;

    @Column(nullable = false)
    private boolean ativo = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "guia_destino",
            joinColumns = @JoinColumn(name = "guia_id"),
            inverseJoinColumns = @JoinColumn(name = "destino_id")
    )
    private Set<Destino> destinos = new HashSet<>();

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
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

    public Set<Destino> getDestinos() {
        return destinos;
    }

    public void setDestinos(Set<Destino> destinos) {
        this.destinos = destinos;
    }
}
