package com.movitur.dto;

import com.movitur.entity.PlanoAnuncio;
import com.movitur.entity.StatusPagamentoEstabelecimento;
import com.movitur.entity.TipoEstabelecimento;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EstabelecimentoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private TipoEstabelecimento tipo;
    private String imagemUrl;
    private String endereco;
    private Double avaliacaoMedia;
    private BigDecimal precoMedio;
    private boolean ativo;
    private Long destinoId;
    private String destinoNome;
    private String destinoCidade;
    private String destinoProvincia;
    private PlanoAnuncio planoAnuncio;
    private StatusPagamentoEstabelecimento statusPagamento;
    private LocalDate dataExpiracao;
    private Integer prioridadeExibicao;
    private Integer prioridadeEfectiva;
    private boolean patrocinado;

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

    public Long getDestinoId() {
        return destinoId;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
    }

    public String getDestinoNome() {
        return destinoNome;
    }

    public void setDestinoNome(String destinoNome) {
        this.destinoNome = destinoNome;
    }

    public String getDestinoCidade() {
        return destinoCidade;
    }

    public void setDestinoCidade(String destinoCidade) {
        this.destinoCidade = destinoCidade;
    }

    public String getDestinoProvincia() {
        return destinoProvincia;
    }

    public void setDestinoProvincia(String destinoProvincia) {
        this.destinoProvincia = destinoProvincia;
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

    public Integer getPrioridadeEfectiva() {
        return prioridadeEfectiva;
    }

    public void setPrioridadeEfectiva(Integer prioridadeEfectiva) {
        this.prioridadeEfectiva = prioridadeEfectiva;
    }

    public boolean isPatrocinado() {
        return patrocinado;
    }

    public void setPatrocinado(boolean patrocinado) {
        this.patrocinado = patrocinado;
    }
}
