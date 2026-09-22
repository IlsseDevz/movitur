package com.movitur.repository;

import com.movitur.entity.MetodoPagamento;
import com.movitur.entity.Pagamento;
import com.movitur.entity.StatusVerificacaoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    List<Pagamento> findByReservaIdOrderByCriadoEmDesc(Long reservaId);

    List<Pagamento> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    List<Pagamento> findAllByOrderByCriadoEmDesc();

    List<Pagamento> findByStatusVerificacaoOrderByCriadoEmDesc(StatusVerificacaoPagamento statusVerificacao);

    long countByStatusVerificacao(StatusVerificacaoPagamento statusVerificacao);

    @Query("""
            SELECT COALESCE(SUM(p.valor), 0) FROM Pagamento p
            WHERE p.statusVerificacao = :status
            """)
    Double somarPorStatus(@Param("status") StatusVerificacaoPagamento status);

    @Query("""
            SELECT COALESCE(SUM(p.valor), 0) FROM Pagamento p
            WHERE p.reserva.id = :reservaId AND p.statusVerificacao = com.movitur.entity.StatusVerificacaoPagamento.CONFIRMADO
            """)
    Double somarConfirmadosPorReserva(@Param("reservaId") Long reservaId);

    @Query("""
            SELECT COALESCE(SUM(p.valor), 0) FROM Pagamento p
            WHERE p.metaPoupanca.id = :metaId AND p.metodo = :metodo
            AND p.statusVerificacao = com.movitur.entity.StatusVerificacaoPagamento.CONFIRMADO
            """)
    Double somarPagamentosPoupancaPorMeta(@Param("metaId") Long metaId, @Param("metodo") MetodoPagamento metodo);
}
