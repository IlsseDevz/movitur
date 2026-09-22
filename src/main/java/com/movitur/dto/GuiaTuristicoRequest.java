package com.movitur.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

public class GuiaTuristicoRequest {

    @NotBlank(message = "O nome e obrigatorio")
    @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres")
    private String nome;

    @Size(max = 2000, message = "A biografia deve ter no maximo 2000 caracteres")
    private String biografia;

    @NotNull(message = "Os anos de experiencia sao obrigatorios")
    @Min(value = 0, message = "Os anos de experiencia devem ser zero ou mais")
    private Integer anosExperiencia;

    @Size(max = 500, message = "A URL da foto deve ter no maximo 500 caracteres")
    private String fotoUrl;

    private boolean ativo = true;

    private Set<Long> destinoIds = new HashSet<>();

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
