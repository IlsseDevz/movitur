package com.movitur.dto;

import com.movitur.entity.TipoExperiencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoriaRequest {

    @NotBlank(message = "O nome e obrigatorio")
    @Size(max = 100, message = "O nome deve ter no maximo 100 caracteres")
    private String nome;

    @Size(max = 500, message = "A descricao deve ter no maximo 500 caracteres")
    private String descricao;

    @NotNull(message = "O tipo de experiencia e obrigatorio")
    private TipoExperiencia tipoExperiencia;

    private boolean ativo = true;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoExperiencia getTipoExperiencia() {
        return tipoExperiencia;
    }

    public void setTipoExperiencia(TipoExperiencia tipoExperiencia) {
        this.tipoExperiencia = tipoExperiencia;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
