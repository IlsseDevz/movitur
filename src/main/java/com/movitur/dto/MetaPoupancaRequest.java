package com.movitur.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class MetaPoupancaRequest {

    @NotBlank(message = "O titulo e obrigatorio.")
    @Size(max = 150)
    private String titulo;

    @NotNull(message = "O valor da meta e obrigatorio.")
    @Min(value = 1, message = "O valor da meta deve ser positivo.")
    private Double valorMeta;

    private Long destinoId;

    private LocalDate dataLimite;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Double getValorMeta() {
        return valorMeta;
    }

    public void setValorMeta(Double valorMeta) {
        this.valorMeta = valorMeta;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
    }
}
