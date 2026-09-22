package com.movitur.dto;

import com.movitur.entity.DepositoPoupanca;

import java.time.LocalDateTime;

public class DepositoPoupancaResponse {

    private Long id;
    private Long metaId;
    private Double valor;
    private String descricao;
    private LocalDateTime criadoEm;

    public static DepositoPoupancaResponse fromEntity(DepositoPoupanca d) {
        DepositoPoupancaResponse res = new DepositoPoupancaResponse();
        res.id = d.getId();
        res.metaId = d.getMeta().getId();
        res.valor = d.getValor();
        res.descricao = d.getDescricao();
        res.criadoEm = d.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public Long getMetaId() {
        return metaId;
    }

    public Double getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
