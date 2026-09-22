package com.movitur.dto;

import java.math.BigDecimal;

public class DestinoSugeridoResponse {

    private Long id;
    private String nome;
    private String cidade;
    private String provincia;
    private BigDecimal precoMedioEstimado;
    private BigDecimal custoTotalEstimado;
    private boolean viavel;

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

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public BigDecimal getPrecoMedioEstimado() {
        return precoMedioEstimado;
    }

    public void setPrecoMedioEstimado(BigDecimal precoMedioEstimado) {
        this.precoMedioEstimado = precoMedioEstimado;
    }

    public BigDecimal getCustoTotalEstimado() {
        return custoTotalEstimado;
    }

    public void setCustoTotalEstimado(BigDecimal custoTotalEstimado) {
        this.custoTotalEstimado = custoTotalEstimado;
    }

    public boolean isViavel() {
        return viavel;
    }

    public void setViavel(boolean viavel) {
        this.viavel = viavel;
    }
}
