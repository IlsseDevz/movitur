package com.movitur.controller;

import com.movitur.dto.NotificacaoResponse;
import com.movitur.service.NotificacaoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping
    public List<NotificacaoResponse> listar() {
        return notificacaoService.listarMinhas();
    }

    @GetMapping("/nao-lidas/contagem")
    public Map<String, Long> contarNaoLidas() {
        return Map.of("total", notificacaoService.contarNaoLidas());
    }

    @PutMapping("/{id}/lida")
    public NotificacaoResponse marcarLida(@PathVariable Long id) {
        return notificacaoService.marcarLida(id);
    }

    @PutMapping("/marcar-todas-lidas")
    public Map<String, Long> marcarTodasLidas() {
        return notificacaoService.marcarTodasLidas();
    }
}
