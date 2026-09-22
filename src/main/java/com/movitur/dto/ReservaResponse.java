package com.movitur.dto;

import com.movitur.entity.Reserva;
import com.movitur.entity.StatusReserva;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservaResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioEmail;
    private Long destinoId;
    private String destinoNome;
    private String destinoCidade;
    private String destinoProvincia;
    private Long guiaId;
    private String guiaNome;
    private LocalDate dataInicio;
    private Integer numeroDias;
    private Integer numeroPessoas;
    private String observacoes;
    private String status;
    private Double precoEstimado;
    private Double valorPago;
    private Double valorRestante;
    private String statusPagamento;
    private boolean avaliada;
    private boolean podeAvaliar;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public static ReservaResponse fromEntity(Reserva r) {
        return fromEntity(r, false);
    }

    public static ReservaResponse fromEntity(Reserva r, boolean avaliada) {
        ReservaResponse res = new ReservaResponse();
        res.id = r.getId();
        res.usuarioId = r.getUsuario().getId();
        res.usuarioNome = r.getUsuario().getNomeCompleto();
        res.usuarioEmail = r.getUsuario().getEmail();
        res.destinoId = r.getDestino().getId();
        res.destinoNome = r.getDestino().getNome();
        res.destinoCidade = r.getDestino().getCidade();
        res.destinoProvincia = r.getDestino().getProvincia();
        if (r.getGuia() != null) {
            res.guiaId = r.getGuia().getId();
            res.guiaNome = r.getGuia().getNome();
        }
        res.dataInicio = r.getDataInicio();
        res.numeroDias = r.getNumeroDias();
        res.numeroPessoas = r.getNumeroPessoas();
        res.observacoes = r.getObservacoes();
        res.status = r.getStatus().name();
        res.precoEstimado = r.getPrecoEstimado();
        res.valorPago = r.getValorPago();
        res.valorRestante = Math.max(0, r.getPrecoEstimado() - r.getValorPago());
        res.statusPagamento = r.getStatusPagamento().name();
        res.avaliada = avaliada;
        res.podeAvaliar = calcularPodeAvaliar(r, avaliada);
        res.criadoEm = r.getCriadoEm();
        res.atualizadoEm = r.getAtualizadoEm();
        return res;
    }

    private static boolean calcularPodeAvaliar(Reserva r, boolean avaliada) {
        if (avaliada || r.getGuia() == null || r.getStatus() != StatusReserva.CONFIRMADA) {
            return false;
        }
        LocalDate fimViagem = r.getDataInicio().plusDays(r.getNumeroDias() - 1L);
        return !LocalDate.now().isBefore(fimViagem);
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public Long getDestinoId() {
        return destinoId;
    }

    public String getDestinoNome() {
        return destinoNome;
    }

    public String getDestinoCidade() {
        return destinoCidade;
    }

    public String getDestinoProvincia() {
        return destinoProvincia;
    }

    public Long getGuiaId() {
        return guiaId;
    }

    public String getGuiaNome() {
        return guiaNome;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public Integer getNumeroDias() {
        return numeroDias;
    }

    public Integer getNumeroPessoas() {
        return numeroPessoas;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public String getStatus() {
        return status;
    }

    public boolean isAvaliada() {
        return avaliada;
    }

    public Double getPrecoEstimado() {
        return precoEstimado;
    }

    public Double getValorPago() {
        return valorPago;
    }

    public Double getValorRestante() {
        return valorRestante;
    }

    public String getStatusPagamento() {
        return statusPagamento;
    }

    public boolean isPodeAvaliar() {
        return podeAvaliar;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}
