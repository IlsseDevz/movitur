package com.movitur.repository;

import com.movitur.entity.Estabelecimento;
import com.movitur.entity.TipoEstabelecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {

    @Query("""
            SELECT e FROM Estabelecimento e
            JOIN FETCH e.destino d
            WHERE (:tipo IS NULL OR e.tipo = :tipo)
            AND (:destinoId IS NULL OR d.id = :destinoId)
            AND (:ativo IS NULL OR e.ativo = :ativo)
            ORDER BY
              CASE WHEN e.statusPagamento = com.movitur.entity.StatusPagamentoEstabelecimento.ATIVO
                   AND (e.dataExpiracao IS NULL OR e.dataExpiracao >= CURRENT_DATE)
                   THEN e.prioridadeExibicao ELSE 0 END DESC,
              e.avaliacaoMedia DESC,
              e.nome ASC
            """)
    List<Estabelecimento> findPublicados(
            @Param("tipo") TipoEstabelecimento tipo,
            @Param("destinoId") Long destinoId,
            @Param("ativo") Boolean ativo);

    @Query("""
            SELECT e FROM Estabelecimento e
            JOIN FETCH e.destino d
            WHERE e.ativo = true
            AND d.id = :destinoId
            AND e.tipo = :tipo
            ORDER BY
              CASE WHEN e.planoAnuncio IN (com.movitur.entity.PlanoAnuncio.PRATA, com.movitur.entity.PlanoAnuncio.OURO)
                   AND e.statusPagamento = com.movitur.entity.StatusPagamentoEstabelecimento.ATIVO
                   AND (e.dataExpiracao IS NULL OR e.dataExpiracao >= CURRENT_DATE)
                   THEN 1 ELSE 0 END DESC,
              CASE WHEN e.statusPagamento = com.movitur.entity.StatusPagamentoEstabelecimento.ATIVO
                   AND (e.dataExpiracao IS NULL OR e.dataExpiracao >= CURRENT_DATE)
                   THEN e.prioridadeExibicao ELSE 0 END DESC,
              e.avaliacaoMedia DESC,
              e.nome ASC
            """)
    List<Estabelecimento> findSugeridosSimulador(
            @Param("destinoId") Long destinoId,
            @Param("tipo") TipoEstabelecimento tipo);
}
