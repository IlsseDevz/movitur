package com.movitur.repository;

import com.movitur.entity.MetaPoupanca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MetaPoupancaRepository extends JpaRepository<MetaPoupanca, Long> {

    List<MetaPoupanca> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<MetaPoupanca> findByIdAndUsuarioId(Long id, Long usuarioId);
}
