package com.movitur.dto;

import com.movitur.entity.MetodoPagamento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PagamentoRequest {

    @NotNull(message = "O id da reserva e obrigatorio.")
    private Long reservaId;

    @NotNull(message = "O valor e obrigatorio.")
    @Min(value = 1, message = "O valor deve ser positivo.")
    private Double valor;

    @NotNull(message = "O metodo de pagamento e obrigatorio.")
    private MetodoPagamento metodo;

    @Size(max = 100)
    private String referencia;

    private Long metaPoupancaId;

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public MetodoPagamento getMetodo() {
        return metodo;
    }

    public void setMetodo(MetodoPagamento metodo) {
        this.metodo = metodo;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Long getMetaPoupancaId() {
        return metaPoupancaId;
    }

    public void setMetaPoupancaId(Long metaPoupancaId) {
        this.metaPoupancaId = metaPoupancaId;
    }
}
