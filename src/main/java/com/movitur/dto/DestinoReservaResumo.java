package com.movitur.dto;

public class DestinoReservaResumo {

    private Long destinoId;
    private String destinoNome;
    private long totalReservas;

    public DestinoReservaResumo(Long destinoId, String destinoNome, long totalReservas) {
        this.destinoId = destinoId;
        this.destinoNome = destinoNome;
        this.totalReservas = totalReservas;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public String getDestinoNome() {
        return destinoNome;
    }

    public long getTotalReservas() {
        return totalReservas;
    }
}
