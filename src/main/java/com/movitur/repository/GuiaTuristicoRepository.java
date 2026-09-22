package com.movitur.repository;

import com.movitur.entity.GuiaTuristico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GuiaTuristicoRepository extends JpaRepository<GuiaTuristico, Long> {

    List<GuiaTuristico> findByAtivoTrue();

    Optional<GuiaTuristico> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT g FROM GuiaTuristico g JOIN g.destinos d WHERE d.id = :destinoId AND g.ativo = true")
    List<GuiaTuristico> findByDestinoId(@Param("destinoId") Long destinoId);
}
