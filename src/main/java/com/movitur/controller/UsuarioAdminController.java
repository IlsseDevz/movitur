package com.movitur.controller;

import com.movitur.dto.UsuarioResponse;
import com.movitur.entity.StatusConta;
import com.movitur.service.UsuarioAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
public class UsuarioAdminController {

    private final UsuarioAdminService usuarioAdminService;

    public UsuarioAdminController(UsuarioAdminService usuarioAdminService) {
        this.usuarioAdminService = usuarioAdminService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar(
            @RequestParam(required = false) StatusConta status) {
        return ResponseEntity.ok(usuarioAdminService.listar(status));
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<UsuarioResponse> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioAdminService.aprovar(id));
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<UsuarioResponse> rejeitar(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String motivo = body != null ? body.get("motivo") : null;
        return ResponseEntity.ok(usuarioAdminService.rejeitar(id, motivo));
    }
}
