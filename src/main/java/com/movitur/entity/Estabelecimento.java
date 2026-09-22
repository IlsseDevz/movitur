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
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "estabelecimentos")
public class Estabelecimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 2000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoEstabelecimento tipo;

    @Column(length = 500)
    private String imagemUrl;

    @Column(length = 300)
    private String endereco;

    @Column(nullable = false)
    private Double avaliacaoMedia = 0.0;

    @Column(precision = 12, scale = 2)
    private BigDecimal precoMedio;

    @Column(nullable = false)
    private boolean ativo = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlanoAnuncio planoAnuncio = PlanoAnuncio.GRATUITO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusPagamentoEstabelecimento statusPagamento = StatusPagamentoEstabelecimento.INATIVO;

    private LocalDate dataExpiracao;

    @Column(nullable = false)
    private Integer prioridadeExibicao = 0;

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoEstabelecimento getTipo() {
        return tipo;
    }

    public void setTipo(TipoEstabelecimento tipo) {
        this.tipo = tipo;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(Double avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    public BigDecimal getPrecoMedio() {
        return precoMedio;
    }

    public void setPrecoMedio(BigDecimal precoMedio) {
        this.precoMedio = precoMedio;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Destino getDestino() {
        return destino;
    }

    public void setDestino(Destino destino) {
        this.destino = destino;
    }

    public PlanoAnuncio getPlanoAnuncio() {
        return planoAnuncio;
    }

    public void setPlanoAnuncio(PlanoAnuncio planoAnuncio) {
        this.planoAnuncio = planoAnuncio;
    }

    public StatusPagamentoEstabelecimento getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(StatusPagamentoEstabelecimento statusPagamento) {
        this.statusPagamento = statusPagamento;
    }

    public LocalDate getDataExpiracao() {
        return dataExpiracao;
    }

    public void setDataExpiracao(LocalDate dataExpiracao) {
        this.dataExpiracao = dataExpiracao;
    }

    public Integer getPrioridadeExibicao() {
        return prioridadeExibicao;
    }

    public void setPrioridadeExibicao(Integer prioridadeExibicao) {
        this.prioridadeExibicao = prioridadeExibicao;
    }
}
