package com.movitur.repository;

import com.movitur.entity.Favorito;
import com.movitur.entity.TipoFavorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);

    boolean existsByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);

    void deleteByUsuarioIdAndTipoAndItemId(Long usuarioId, TipoFavorito tipo, Long itemId);
}
