package com.movitur.dto;

import com.movitur.entity.TipoExperiencia;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class SimuladorRequest {

    @NotNull(message = "O orcamento e obrigatorio")
    @DecimalMin(value = "0.01", message = "O orcamento deve ser maior que zero")
    private BigDecimal orcamento;

    @NotNull(message = "O numero de dias e obrigatorio")
    @Min(value = 1, message = "O numero de dias deve ser pelo menos 1")
    private Integer numeroDias;

    private TipoExperiencia tipoExperiencia;

    private Long destinoId;

    @Size(max = 150, message = "O titulo deve ter no maximo 150 caracteres")
    private String titulo;

    private boolean guardar = false;

    public BigDecimal getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(BigDecimal orcamento) {
        this.orcamento = orcamento;
    }

    public Integer getNumeroDias() {
        return numeroDias;
    }

    public void setNumeroDias(Integer numeroDias) {
        this.numeroDias = numeroDias;
    }

    public TipoExperiencia getTipoExperiencia() {
        return tipoExperiencia;
    }

    public void setTipoExperiencia(TipoExperiencia tipoExperiencia) {
        this.tipoExperiencia = tipoExperiencia;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public boolean isGuardar() {
        return guardar;
    }

    public void setGuardar(boolean guardar) {
        this.guardar = guardar;
    }
}
