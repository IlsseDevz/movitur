package com.movitur.repository;

import com.movitur.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByGuiaIdOrderByCriadoEmDesc(Long guiaId);

    boolean existsByReservaId(Long reservaId);

    Optional<Avaliacao> findByReservaId(Long reservaId);

    @Query("SELECT COALESCE(AVG(a.nota), 0) FROM Avaliacao a WHERE a.guia.id = :guiaId")
    Double calcularMediaPorGuia(@Param("guiaId") Long guiaId);
}
