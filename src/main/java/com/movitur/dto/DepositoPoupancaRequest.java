package com.movitur.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DepositoPoupancaRequest {

    @NotNull(message = "O valor e obrigatorio.")
    @Min(value = 1, message = "O valor deve ser positivo.")
    private Double valor;

    @Size(max = 255)
    private String descricao;

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
