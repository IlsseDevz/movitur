package com.movitur.repository;

import com.movitur.entity.Role;
import com.movitur.entity.StatusConta;
import com.movitur.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<Usuario> findByStatus(StatusConta status);

    List<Usuario> findByRole(Role role);

    long countByRole(Role role);
}
