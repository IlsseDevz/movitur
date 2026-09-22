package com.movitur.service;

import com.movitur.dto.UsuarioResponse;
import com.movitur.dto.email.UsuarioEmailData;
import com.movitur.entity.StatusConta;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioAdminService {

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public UsuarioAdminService(UsuarioRepository usuarioRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    public List<UsuarioResponse> listar(StatusConta status) {
        List<Usuario> usuarios = (status == null)
                ? usuarioRepository.findAll()
                : usuarioRepository.findByStatus(status);
        return usuarios.stream().map(UsuarioResponse::fromEntity).toList();
    }

    public UsuarioResponse aprovar(Long id) {
        Usuario usuario = buscar(id);
        if (usuario.getStatus() == StatusConta.APROVADO) {
            throw new RegraNegocioException("Esta conta ja esta aprovada.");
        }
        usuario.setStatus(StatusConta.APROVADO);
        usuario.setAtualizadoEm(LocalDateTime.now());
        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarEmailBoasVindas(UsuarioEmailData.from(guardado));
        return UsuarioResponse.fromEntity(guardado);
    }

    public UsuarioResponse rejeitar(Long id, String motivo) {
        Usuario usuario = buscar(id);
        usuario.setStatus(StatusConta.REJEITADO);
        usuario.setAtualizadoEm(LocalDateTime.now());
        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarEmailRejeicao(UsuarioEmailData.from(guardado), motivo);
        return UsuarioResponse.fromEntity(guardado);
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado com id: " + id));
    }
}
