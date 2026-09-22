package com.movitur.repository;

import com.movitur.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);

    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(Long usuarioId);
}
