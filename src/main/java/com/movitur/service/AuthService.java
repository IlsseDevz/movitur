package com.movitur.service;

import com.movitur.dto.AlterarSenhaRequest;
import com.movitur.dto.AtualizarPerfilRequest;
import com.movitur.dto.AuthResponse;
import com.movitur.dto.LoginRequest;
import com.movitur.dto.RecuperarSenhaRequest;
import com.movitur.dto.RedefinirSenhaRequest;
import com.movitur.dto.RegistoRequest;
import com.movitur.dto.UsuarioResponse;
import com.movitur.dto.email.UsuarioEmailData;
import com.movitur.entity.PasswordResetToken;
import com.movitur.entity.Role;
import com.movitur.entity.StatusConta;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.PasswordResetTokenRepository;
import com.movitur.repository.UsuarioRepository;
import com.movitur.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public UsuarioResponse registar(RegistoRequest request) {
        if (usuarioRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new RegraNegocioException("Ja existe uma conta registada com este email.");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(request.getNomeCompleto());
        usuario.setEmail(request.getEmail().toLowerCase());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setTelefone(request.getTelefone());
        usuario.setRole(Role.CLIENTE);
        usuario.setStatus(StatusConta.PENDENTE);

        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarEmailNovoRegistoAdmin(UsuarioEmailData.from(guardado));
        return UsuarioResponse.fromEntity(guardado);
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RegraNegocioException("Email ou senha incorretos."));

        if (usuario.getStatus() == StatusConta.PENDENTE) {
            throw new RegraNegocioException("A sua conta ainda esta a aguardar aprovacao do administrador.");
        }
        if (usuario.getStatus() == StatusConta.REJEITADO) {
            throw new RegraNegocioException("O seu registo foi rejeitado. Contacte o suporte para mais informacoes.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usuario.getEmail(), request.getSenha()));

        String token = jwtService.gerarToken(
                usuario.getEmail(),
                Map.of("role", usuario.getRole().name(), "nome", usuario.getNomeCompleto()));

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getRole().name());
    }

    @Transactional(readOnly = true)
    public UsuarioResponse perfilAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
        return UsuarioResponse.fromEntity(usuario);
    }

    public void solicitarRecuperacaoSenha(RecuperarSenhaRequest request) {
        usuarioRepository.findByEmailIgnoreCase(request.getEmail()).ifPresent(usuario -> {
            tokenRepository.deleteByUsuarioId(usuario.getId());

            PasswordResetToken token = new PasswordResetToken();
            token.setToken(UUID.randomUUID().toString());
            token.setUsuario(usuario);
            token.setExpiraEm(LocalDateTime.now().plusHours(1));
            tokenRepository.save(token);

            emailService.enviarEmailRecuperacaoSenha(UsuarioEmailData.from(usuario), token.getToken());
        });
    }

    public void redefinirSenha(RedefinirSenhaRequest request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RegraNegocioException("Token invalido ou expirado."));

        if (token.isUsado()) {
            throw new RegraNegocioException("Este link ja foi utilizado.");
        }
        if (token.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RegraNegocioException("Token invalido ou expirado.");
        }

        Usuario usuario = token.getUsuario();
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        token.setUsado(true);
        tokenRepository.save(token);

        emailService.enviarEmailSenhaAlterada(UsuarioEmailData.from(usuario));
    }

    public UsuarioResponse atualizarPerfil(AtualizarPerfilRequest request) {
        Usuario usuario = getUsuarioAutenticado();
        usuario.setTelefone(request.getTelefone());
        usuario.setAtualizadoEm(LocalDateTime.now());
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    public void alterarSenha(AlterarSenhaRequest request) {
        Usuario usuario = getUsuarioAutenticado();

        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
            throw new RegraNegocioException("A senha atual esta incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);
        emailService.enviarEmailSenhaAlterada(UsuarioEmailData.from(usuario));
    }

    private Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        return usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
    }
}
