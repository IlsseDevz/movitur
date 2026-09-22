package com.movitur.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class DestinoRequest {

    @NotBlank(message = "O nome e obrigatorio")
    @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres")
    private String nome;

    @Size(max = 2000, message = "A descricao deve ter no maximo 2000 caracteres")
    private String descricao;

    @NotBlank(message = "A provincia e obrigatoria")
    @Size(max = 100, message = "A provincia deve ter no maximo 100 caracteres")
    private String provincia;

    @NotBlank(message = "A cidade e obrigatoria")
    @Size(max = 100, message = "A cidade deve ter no maximo 100 caracteres")
    private String cidade;

    @Size(max = 500, message = "A URL da imagem deve ter no maximo 500 caracteres")
    private String imagemUrl;

    @DecimalMin(value = "0.0", inclusive = false, message = "O preco medio estimado deve ser maior que zero")
    private BigDecimal precoMedioEstimado;

    @NotNull(message = "A categoria e obrigatoria")
    private Long categoriaId;

    private boolean ativo = true;

    private Double latitude;

    private Double longitude;

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

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public BigDecimal getPrecoMedioEstimado() {
        return precoMedioEstimado;
    }

    public void setPrecoMedioEstimado(BigDecimal precoMedioEstimado) {
        this.precoMedioEstimado = precoMedioEstimado;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
