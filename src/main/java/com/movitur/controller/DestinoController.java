package com.movitur.controller;

import com.movitur.dto.DestinoOrdenacao;
import com.movitur.dto.DestinoRequest;
import com.movitur.dto.DestinoResponse;
import com.movitur.service.DestinoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/destinos")
public class DestinoController {

    private final DestinoService destinoService;

    public DestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DestinoResponse criar(@Valid @RequestBody DestinoRequest request) {
        return destinoService.criar(request);
    }

    @GetMapping
    public List<DestinoResponse> listar(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String provincia,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax,
            @RequestParam(required = false) DestinoOrdenacao ordenacao) {
        return destinoService.listar(ativo, categoriaId, provincia, q, precoMin, precoMax, ordenacao);
    }

    @GetMapping("/{id}")
    public DestinoResponse buscarPorId(@PathVariable Long id) {
        return destinoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public DestinoResponse atualizar(@PathVariable Long id, @Valid @RequestBody DestinoRequest request) {
        return destinoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        destinoService.remover(id);
    }
}
