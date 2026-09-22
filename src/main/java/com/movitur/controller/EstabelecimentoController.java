package com.movitur.controller;

import com.movitur.dto.EstabelecimentoRequest;
import com.movitur.dto.EstabelecimentoResponse;
import com.movitur.entity.TipoEstabelecimento;
import com.movitur.service.EstabelecimentoService;
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

import java.util.List;

@RestController
@RequestMapping("/api/estabelecimentos")
public class EstabelecimentoController {

    private final EstabelecimentoService estabelecimentoService;

    public EstabelecimentoController(EstabelecimentoService estabelecimentoService) {
        this.estabelecimentoService = estabelecimentoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstabelecimentoResponse criar(@Valid @RequestBody EstabelecimentoRequest request) {
        return estabelecimentoService.criar(request);
    }

    @GetMapping
    public List<EstabelecimentoResponse> listar(
            @RequestParam(required = false) TipoEstabelecimento tipo,
            @RequestParam(required = false) Long destinoId,
            @RequestParam(required = false) String provincia,
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false, defaultValue = "true") Boolean ativo) {
        return estabelecimentoService.listar(tipo, destinoId, provincia, cidade, ativo);
    }

    @GetMapping("/{id}")
    public EstabelecimentoResponse buscarPorId(@PathVariable Long id) {
        return estabelecimentoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public EstabelecimentoResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EstabelecimentoRequest request) {
        return estabelecimentoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        estabelecimentoService.remover(id);
    }
}
