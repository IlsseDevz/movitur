package com.movitur.controller;

import com.movitur.dto.AlterarSenhaRequest;
import com.movitur.dto.AtualizarPerfilRequest;
import com.movitur.dto.AuthResponse;
import com.movitur.dto.LoginRequest;
import com.movitur.dto.RecuperarSenhaRequest;
import com.movitur.dto.RedefinirSenhaRequest;
import com.movitur.dto.RegistoRequest;
import com.movitur.dto.UsuarioResponse;
import com.movitur.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registo")
    public ResponseEntity<Map<String, Object>> registar(@Valid @RequestBody RegistoRequest request) {
        UsuarioResponse usuario = authService.registar(request);
        Map<String, Object> resposta = Map.of(
                "mensagem", "Registo efetuado com sucesso. Aguarde a aprovacao do administrador; sera notificado por email.",
                "usuario", usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public UsuarioResponse perfil() {
        return authService.perfilAtual();
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, String>> recuperarSenha(@Valid @RequestBody RecuperarSenhaRequest request) {
        authService.solicitarRecuperacaoSenha(request);
        return ResponseEntity.ok(Map.of(
                "mensagem", "Se o email existir na plataforma, recebera instrucoes para redefinir a senha."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequest request) {
        authService.redefinirSenha(request);
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso. Ja pode iniciar sessao."));
    }

    @PutMapping("/perfil")
    public UsuarioResponse atualizarPerfil(@Valid @RequestBody AtualizarPerfilRequest request) {
        return authService.atualizarPerfil(request);
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<Map<String, String>> alterarSenha(@Valid @RequestBody AlterarSenhaRequest request) {
        authService.alterarSenha(request);
        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso."));
    }
}
