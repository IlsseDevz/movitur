package com.movitur.repository;

import com.movitur.entity.Destino;
import com.movitur.entity.TipoExperiencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Long>, JpaSpecificationExecutor<Destino> {

    List<Destino> findByAtivoTrue();

    List<Destino> findByCategoriaId(Long categoriaId);

    List<Destino> findByProvinciaIgnoreCase(String provincia);

    List<Destino> findByCidadeIgnoreCase(String cidade);

    @Query("""
            SELECT d FROM Destino d
            JOIN d.categoria c
            WHERE d.ativo = true
            AND (:tipoExperiencia IS NULL OR c.tipoExperiencia = :tipoExperiencia)
            ORDER BY d.precoMedioEstimado ASC
            """)
    List<Destino> findDestinosAtivosPorTipo(@Param("tipoExperiencia") TipoExperiencia tipoExperiencia);

    @Query("""
            SELECT d FROM Destino d
            JOIN d.categoria c
            WHERE d.ativo = true
            AND (:tipoExperiencia IS NULL OR c.tipoExperiencia = :tipoExperiencia)
            AND COALESCE(d.precoMedioEstimado, :custoDiarioPadrao) * :numeroDias <= :orcamento
            ORDER BY d.precoMedioEstimado ASC
            """)
    List<Destino> findDestinosViaveis(
            @Param("orcamento") BigDecimal orcamento,
            @Param("numeroDias") Integer numeroDias,
            @Param("tipoExperiencia") TipoExperiencia tipoExperiencia,
            @Param("custoDiarioPadrao") BigDecimal custoDiarioPadrao);
}
