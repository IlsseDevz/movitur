package com.movitur.repository;

import com.movitur.entity.SimulacaoViagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SimulacaoViagemRepository extends JpaRepository<SimulacaoViagem, Long> {

    List<SimulacaoViagem> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<SimulacaoViagem> findByIdAndUsuarioId(Long id, Long usuarioId);
}
