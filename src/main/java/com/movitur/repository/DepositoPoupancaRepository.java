package com.movitur.repository;

import com.movitur.entity.DepositoPoupanca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepositoPoupancaRepository extends JpaRepository<DepositoPoupanca, Long> {

    List<DepositoPoupanca> findByMetaIdOrderByCriadoEmDesc(Long metaId);

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM DepositoPoupanca d WHERE d.meta.id = :metaId")
    Double somarDepositosPorMeta(@Param("metaId") Long metaId);
}
