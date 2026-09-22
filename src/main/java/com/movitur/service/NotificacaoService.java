package com.movitur.service;

import com.movitur.dto.NotificacaoResponse;
import com.movitur.entity.Notificacao;
import com.movitur.entity.Role;
import com.movitur.entity.Usuario;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.NotificacaoRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository, UsuarioRepository usuarioRepository) {
        this.notificacaoRepository = notificacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void enviar(Usuario usuario, String titulo, String mensagem, String link) {
        Notificacao n = new Notificacao();
        n.setUsuario(usuario);
        n.setTitulo(titulo);
        n.setMensagem(mensagem);
        n.setLink(link);
        notificacaoRepository.save(n);
    }

    public void enviarParaAdmins(String titulo, String mensagem, String link) {
        for (Usuario admin : usuarioRepository.findByRole(Role.ADMIN)) {
            enviar(admin, titulo, mensagem, link);
        }
    }

    @Transactional(readOnly = true)
    public List<NotificacaoResponse> listarMinhas() {
        Usuario usuario = getUsuarioAtual();
        return notificacaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuario.getId())
                .stream()
                .map(NotificacaoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas() {
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(getUsuarioAtual().getId());
    }

    public NotificacaoResponse marcarLida(Long id) {
        Notificacao n = buscarDoUsuario(id);
        n.setLida(true);
        return NotificacaoResponse.fromEntity(notificacaoRepository.save(n));
    }

    public Map<String, Long> marcarTodasLidas() {
        Usuario usuario = getUsuarioAtual();
        List<Notificacao> naoLidas = notificacaoRepository
                .findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(usuario.getId());
        naoLidas.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(naoLidas);
        return Map.of("actualizadas", (long) naoLidas.size());
    }

    private Notificacao buscarDoUsuario(Long id) {
        Usuario usuario = getUsuarioAtual();
        Notificacao n = notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacao nao encontrada."));
        if (!n.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Notificacao nao encontrada.");
        }
        return n;
    }

    private Usuario getUsuarioAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResourceNotFoundException("Utilizador nao autenticado.");
        }
        return usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
    }
}
