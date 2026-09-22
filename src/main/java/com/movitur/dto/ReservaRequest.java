package com.movitur.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ReservaRequest {

    @NotNull(message = "O destino e obrigatorio")
    private Long destinoId;

    private Long guiaId;

    @NotNull(message = "A data de inicio e obrigatoria")
    @FutureOrPresent(message = "A data de inicio nao pode ser no passado")
    private LocalDate dataInicio;

    @NotNull(message = "O numero de dias e obrigatorio")
    @Min(value = 1, message = "O numero de dias deve ser pelo menos 1")
    private Integer numeroDias;

    @NotNull(message = "O numero de pessoas e obrigatorio")
    @Min(value = 1, message = "O numero de pessoas deve ser pelo menos 1")
    private Integer numeroPessoas;

    @Size(max = 1000, message = "As observacoes devem ter no maximo 1000 caracteres")
    private String observacoes;

    public Long getDestinoId() {
        return destinoId;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
    }

    public Long getGuiaId() {
        return guiaId;
    }

    public void setGuiaId(Long guiaId) {
        this.guiaId = guiaId;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Integer getNumeroDias() {
        return numeroDias;
    }

    public void setNumeroDias(Integer numeroDias) {
        this.numeroDias = numeroDias;
    }

    public Integer getNumeroPessoas() {
        return numeroPessoas;
    }

    public void setNumeroPessoas(Integer numeroPessoas) {
        this.numeroPessoas = numeroPessoas;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
