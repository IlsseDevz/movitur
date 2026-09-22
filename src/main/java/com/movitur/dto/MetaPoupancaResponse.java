package com.movitur.dto;

import com.movitur.entity.MetaPoupanca;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MetaPoupancaResponse {

    private Long id;
    private String titulo;
    private Double valorMeta;
    private Double valorAcumulado;
    private Double percentual;
    private Long destinoId;
    private String destinoNome;
    private LocalDate dataLimite;
    private boolean ativa;
    private LocalDateTime criadoEm;

    public static MetaPoupancaResponse fromEntity(MetaPoupanca meta, double valorAcumulado) {
        MetaPoupancaResponse res = new MetaPoupancaResponse();
        res.id = meta.getId();
        res.titulo = meta.getTitulo();
        res.valorMeta = meta.getValorMeta();
        res.valorAcumulado = valorAcumulado;
        res.percentual = meta.getValorMeta() > 0
                ? Math.min(100.0, Math.round(valorAcumulado / meta.getValorMeta() * 1000.0) / 10.0)
                : 0.0;
        if (meta.getDestino() != null) {
            res.destinoId = meta.getDestino().getId();
            res.destinoNome = meta.getDestino().getNome();
        }
        res.dataLimite = meta.getDataLimite();
        res.ativa = meta.isAtiva();
        res.criadoEm = meta.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public Double getValorMeta() {
        return valorMeta;
    }

    public Double getValorAcumulado() {
        return valorAcumulado;
    }

    public Double getPercentual() {
        return percentual;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public String getDestinoNome() {
        return destinoNome;
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
