package com.movitur.dto;

import java.util.List;

public class RelatorioResumoResponse {

    private long totalClientes;
    private long reservasPendentes;
    private long reservasConfirmadas;
    private long reservasCanceladas;
    private long reservasRejeitadas;
    private double receitaConfirmada;
    private long pagamentosPendentes;
    private double valorReservasConfirmadas;
    private List<DestinoReservaResumo> topDestinos;

    public long getTotalClientes() {
        return totalClientes;
    }

    public void setTotalClientes(long totalClientes) {
        this.totalClientes = totalClientes;
    }

    public long getReservasPendentes() {
        return reservasPendentes;
    }

    public void setReservasPendentes(long reservasPendentes) {
        this.reservasPendentes = reservasPendentes;
    }

    public long getReservasConfirmadas() {
        return reservasConfirmadas;
    }

    public void setReservasConfirmadas(long reservasConfirmadas) {
        this.reservasConfirmadas = reservasConfirmadas;
    }

    public long getReservasCanceladas() {
        return reservasCanceladas;
    }

    public void setReservasCanceladas(long reservasCanceladas) {
        this.reservasCanceladas = reservasCanceladas;
    }

    public long getReservasRejeitadas() {
        return reservasRejeitadas;
    }

    public void setReservasRejeitadas(long reservasRejeitadas) {
        this.reservasRejeitadas = reservasRejeitadas;
    }

    public double getReceitaConfirmada() {
        return receitaConfirmada;
    }

    public void setReceitaConfirmada(double receitaConfirmada) {
        this.receitaConfirmada = receitaConfirmada;
    }

    public long getPagamentosPendentes() {
        return pagamentosPendentes;
    }

    public void setPagamentosPendentes(long pagamentosPendentes) {
        this.pagamentosPendentes = pagamentosPendentes;
    }

    public double getValorReservasConfirmadas() {
        return valorReservasConfirmadas;
    }

    public void setValorReservasConfirmadas(double valorReservasConfirmadas) {
        this.valorReservasConfirmadas = valorReservasConfirmadas;
    }

    public List<DestinoReservaResumo> getTopDestinos() {
        return topDestinos;
    }

    public void setTopDestinos(List<DestinoReservaResumo> topDestinos) {
        this.topDestinos = topDestinos;
    }
}
