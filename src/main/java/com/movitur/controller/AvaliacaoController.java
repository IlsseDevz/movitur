package com.movitur.controller;

import com.movitur.dto.AvaliacaoRequest;
import com.movitur.dto.AvaliacaoResponse;
import com.movitur.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvaliacaoResponse criar(@Valid @RequestBody AvaliacaoRequest request) {
        return avaliacaoService.criar(request);
    }

    @GetMapping("/guia/{guiaId}")
    public List<AvaliacaoResponse> listarPorGuia(@PathVariable Long guiaId) {
        return avaliacaoService.listarPorGuia(guiaId);
    }
}
