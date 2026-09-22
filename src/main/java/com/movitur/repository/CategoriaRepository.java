package com.movitur.repository;

import com.movitur.entity.Categoria;
import com.movitur.entity.TipoExperiencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByAtivoTrue();

    List<Categoria> findByTipoExperiencia(TipoExperiencia tipoExperiencia);

    Optional<Categoria> findByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCase(String nome);
}
