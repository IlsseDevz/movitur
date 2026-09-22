package com.movitur.dto;

import com.movitur.entity.Pagamento;

import java.time.LocalDateTime;

public class PagamentoResponse {

    private Long id;
    private Long reservaId;
    private String destinoNome;
    private Double valor;
    private String metodo;
    private String referencia;
    private Long metaPoupancaId;
    private String metaPoupancaTitulo;
    private String usuarioNome;
    private String usuarioEmail;
    private String statusVerificacao;
    private String motivoRejeicao;
    private LocalDateTime criadoEm;

    public static PagamentoResponse fromEntity(Pagamento p) {
        PagamentoResponse res = new PagamentoResponse();
        res.id = p.getId();
        res.reservaId = p.getReserva().getId();
        res.destinoNome = p.getReserva().getDestino().getNome();
        res.valor = p.getValor();
        res.metodo = p.getMetodo().name();
        res.referencia = p.getReferencia();
        if (p.getMetaPoupanca() != null) {
            res.metaPoupancaId = p.getMetaPoupanca().getId();
            res.metaPoupancaTitulo = p.getMetaPoupanca().getTitulo();
        }
        res.usuarioNome = p.getUsuario().getNomeCompleto();
        res.usuarioEmail = p.getUsuario().getEmail();
        res.statusVerificacao = p.getStatusVerificacao().name();
        res.motivoRejeicao = p.getMotivoRejeicao();
        res.criadoEm = p.getCriadoEm();
        return res;
    }

    public Long getId() {
        return id;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public String getDestinoNome() {
        return destinoNome;
    }

    public Double getValor() {
        return valor;
    }

    public String getMetodo() {
        return metodo;
    }

    public String getReferencia() {
        return referencia;
    }

    public Long getMetaPoupancaId() {
        return metaPoupancaId;
    }

    public String getMetaPoupancaTitulo() {
        return metaPoupancaTitulo;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public String getStatusVerificacao() {
        return statusVerificacao;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }
}
