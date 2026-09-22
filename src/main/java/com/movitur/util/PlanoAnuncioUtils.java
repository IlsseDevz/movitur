package com.movitur.util;

import com.movitur.entity.Estabelecimento;
import com.movitur.entity.PlanoAnuncio;
import com.movitur.entity.StatusPagamentoEstabelecimento;

import java.time.LocalDate;

public final class PlanoAnuncioUtils {

    private PlanoAnuncioUtils() {
    }

    public static int prioridadeDe(PlanoAnuncio plano) {
        if (plano == null) {
            return 0;
        }
        return switch (plano) {
            case OURO -> 3;
            case PRATA -> 2;
            case BRONZE -> 1;
            default -> 0;
        };
    }

    public static int prioridadeEfectiva(Estabelecimento estabelecimento) {
        if (estabelecimento.getStatusPagamento() != StatusPagamentoEstabelecimento.ATIVO) {
            return 0;
        }
        LocalDate expiracao = estabelecimento.getDataExpiracao();
        if (expiracao != null && expiracao.isBefore(LocalDate.now())) {
            return 0;
        }
        return estabelecimento.getPrioridadeExibicao() != null
                ? estabelecimento.getPrioridadeExibicao()
                : prioridadeDe(estabelecimento.getPlanoAnuncio());
    }

    public static boolean patrocinado(Estabelecimento estabelecimento) {
        return prioridadeEfectiva(estabelecimento) > 0
                && estabelecimento.getPlanoAnuncio() != PlanoAnuncio.GRATUITO;
    }
}
