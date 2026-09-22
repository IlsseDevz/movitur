package com.movitur.repository;

import com.movitur.entity.Feedback;
import com.movitur.entity.TipoFeedbackAlvo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByTipoAlvoAndEntidadeIdOrderByCriadoEmDesc(TipoFeedbackAlvo tipoAlvo, Long entidadeId);

    List<Feedback> findAllByOrderByCriadoEmDesc();

    List<Feedback> findTop20ByOrderByCriadoEmDesc();

    @Query("SELECT COALESCE(AVG(f.estrelas), 0) FROM Feedback f")
    Double calcularMediaGlobal();

    @Query("""
            SELECT COALESCE(AVG(f.estrelas), 0) FROM Feedback f
            WHERE f.tipoAlvo = :tipoAlvo AND f.entidadeId = :entidadeId
            """)
    Double calcularMediaPorEntidade(TipoFeedbackAlvo tipoAlvo, Long entidadeId);

    long countByTipoAlvoAndEntidadeId(TipoFeedbackAlvo tipoAlvo, Long entidadeId);
}
