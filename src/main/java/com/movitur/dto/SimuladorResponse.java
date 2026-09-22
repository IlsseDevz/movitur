package com.movitur.dto;

import com.movitur.entity.TipoExperiencia;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SimuladorResponse {

    private Long simulacaoId;
    private String titulo;
    private Long destinoId;
    private String destinoNome;
    private String destinoCidade;
    private String destinoProvincia;
    private BigDecimal orcamento;
    private Integer numeroDias;
    private TipoExperiencia tipoExperiencia;
    private BigDecimal custoHospedagem;
    private BigDecimal custoAlimentacao;
    private BigDecimal custoTransporte;
    private BigDecimal custoAtividades;
    private BigDecimal custoTotal;
    private boolean viagemViavel;
    private BigDecimal saldoRestante;
    private String mensagem;
    private LocalDateTime criadoEm;
    private List<DestinoSugeridoResponse> destinosSugeridos = new ArrayList<>();
    private List<EstabelecimentoResponse> hoteisSugeridos = new ArrayList<>();
    private List<EstabelecimentoResponse> restaurantesSugeridos = new ArrayList<>();

    public Long getSimulacaoId() {
        return simulacaoId;
    }

    public void setSimulacaoId(Long simulacaoId) {
        this.simulacaoId = simulacaoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public List<DestinoSugeridoResponse> getDestinosSugeridos() {
        return destinosSugeridos;
    }

    public void setDestinosSugeridos(List<DestinoSugeridoResponse> destinosSugeridos) {
        this.destinosSugeridos = destinosSugeridos;
    }

    public List<EstabelecimentoResponse> getHoteisSugeridos() {
        return hoteisSugeridos;
    }

    public void setHoteisSugeridos(List<EstabelecimentoResponse> hoteisSugeridos) {
        this.hoteisSugeridos = hoteisSugeridos;
    }

    public List<EstabelecimentoResponse> getRestaurantesSugeridos() {
        return restaurantesSugeridos;
    }

    public void setRestaurantesSugeridos(List<EstabelecimentoResponse> restaurantesSugeridos) {
        this.restaurantesSugeridos = restaurantesSugeridos;
    }
}
