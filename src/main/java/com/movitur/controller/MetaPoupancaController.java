package com.movitur.controller;

import com.movitur.dto.DepositoPoupancaRequest;
import com.movitur.dto.DepositoPoupancaResponse;
import com.movitur.dto.MetaPoupancaRequest;
import com.movitur.dto.MetaPoupancaResponse;
import com.movitur.service.MetaPoupancaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/poupancas")
public class MetaPoupancaController {

    private final MetaPoupancaService metaPoupancaService;

    public MetaPoupancaController(MetaPoupancaService metaPoupancaService) {
        this.metaPoupancaService = metaPoupancaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetaPoupancaResponse criar(@Valid @RequestBody MetaPoupancaRequest request) {
        return metaPoupancaService.criar(request);
    }

    @GetMapping
    public List<MetaPoupancaResponse> listarMinhas() {
        return metaPoupancaService.listarMinhas();
    }

    @GetMapping("/{id}")
    public MetaPoupancaResponse buscar(@PathVariable Long id) {
        return metaPoupancaService.buscarMinha(id);
    }

    @PostMapping("/{id}/depositos")
    @ResponseStatus(HttpStatus.CREATED)
    public DepositoPoupancaResponse depositar(
            @PathVariable Long id,
            @Valid @RequestBody DepositoPoupancaRequest request) {
        return metaPoupancaService.depositar(id, request);
    }

    @GetMapping("/{id}/depositos")
    public List<DepositoPoupancaResponse> listarDepositos(@PathVariable Long id) {
        return metaPoupancaService.listarDepositos(id);
    }

    @PutMapping("/{id}/encerrar")
    public MetaPoupancaResponse encerrar(@PathVariable Long id) {
        metaPoupancaService.encerrar(id);
        return metaPoupancaService.buscarMinha(id);
    }
}
