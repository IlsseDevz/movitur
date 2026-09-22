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

import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Double valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MetodoPagamento metodo;

    @Column(length = 100)
    private String referencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meta_poupanca_id")
    private MetaPoupanca metaPoupanca;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_verificacao", nullable = false, length = 20,
            columnDefinition = "varchar(20) not null default 'CONFIRMADO'")
    private StatusVerificacaoPagamento statusVerificacao = StatusVerificacaoPagamento.PENDENTE;

    @Column(length = 500)
    private String motivoRejeicao;

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

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public MetaPoupanca getMetaPoupanca() {
        return metaPoupanca;
    }

    public void setMetaPoupanca(MetaPoupanca metaPoupanca) {
        this.metaPoupanca = metaPoupanca;
    }

    public StatusVerificacaoPagamento getStatusVerificacao() {
        return statusVerificacao;
    }

    public void setStatusVerificacao(StatusVerificacaoPagamento statusVerificacao) {
        this.statusVerificacao = statusVerificacao;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public void setMotivoRejeicao(String motivoRejeicao) {
        this.motivoRejeicao = motivoRejeicao;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
