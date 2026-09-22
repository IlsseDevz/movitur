package com.movitur.dto;

import com.movitur.entity.PlanoAnuncio;
import com.movitur.entity.StatusPagamentoEstabelecimento;
import com.movitur.entity.TipoEstabelecimento;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EstabelecimentoRequest {

    @NotBlank(message = "O nome e obrigatorio")
    @Size(max = 150)
    private String nome;

    @Size(max = 2000)
    private String descricao;

    @NotNull(message = "O tipo e obrigatorio")
    private TipoEstabelecimento tipo;

    @Size(max = 500)
    private String imagemUrl;

    @Size(max = 300)
    private String endereco;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    private Double avaliacaoMedia;

    private BigDecimal precoMedio;

    @NotNull(message = "O destino e obrigatorio")
    private Long destinoId;

    @NotNull(message = "O plano de anuncio e obrigatorio")
    private PlanoAnuncio planoAnuncio;

    @NotNull(message = "O status de pagamento e obrigatorio")
    private StatusPagamentoEstabelecimento statusPagamento;

    private LocalDate dataExpiracao;

    private boolean ativo = true;

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

    public Long getDestinoId() {
        return destinoId;
    }

    public void setDestinoId(Long destinoId) {
        this.destinoId = destinoId;
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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
