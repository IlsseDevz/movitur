package com.movitur.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulacoes_viagem")
public class SimulacaoViagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150)
    private String titulo;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal orcamento;

    @Column(nullable = false)
    private Integer numeroDias;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TipoExperiencia tipoExperiencia;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal custoHospedagem;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal custoAlimentacao;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal custoTransporte;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal custoAtividades;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal custoTotal;

    @Column(nullable = false)
    private boolean viagemViavel;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal saldoRestante;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        criadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

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

    public Destino getDestino() {
        return destino;
    }

    public void setDestino(Destino destino) {
        this.destino = destino;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public BigDecimal getCustoHospedagem() {
        return custoHospedagem;
    }

    public void setCustoHospedagem(BigDecimal custoHospedagem) {
        this.custoHospedagem = custoHospedagem;
    }

    public BigDecimal getCustoAlimentacao() {
        return custoAlimentacao;
    }

    public void setCustoAlimentacao(BigDecimal custoAlimentacao) {
        this.custoAlimentacao = custoAlimentacao;
    }

    public BigDecimal getCustoTransporte() {
        return custoTransporte;
    }

    public void setCustoTransporte(BigDecimal custoTransporte) {
        this.custoTransporte = custoTransporte;
    }

    public BigDecimal getCustoAtividades() {
        return custoAtividades;
    }

    public void setCustoAtividades(BigDecimal custoAtividades) {
        this.custoAtividades = custoAtividades;
    }

    public BigDecimal getCustoTotal() {
        return custoTotal;
    }

    public void setCustoTotal(BigDecimal custoTotal) {
        this.custoTotal = custoTotal;
    }

    public boolean isViagemViavel() {
        return viagemViavel;
    }

    public void setViagemViavel(boolean viagemViavel) {
        this.viagemViavel = viagemViavel;
    }

    public BigDecimal getSaldoRestante() {
        return saldoRestante;
    }

    public void setSaldoRestante(BigDecimal saldoRestante) {
        this.saldoRestante = saldoRestante;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
