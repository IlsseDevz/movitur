package com.movitur.controller;

import com.movitur.dto.SimuladorRequest;
import com.movitur.dto.SimuladorResponse;
import com.movitur.service.SimuladorViagemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulador")
public class SimuladorViagemController {

    private final SimuladorViagemService simuladorViagemService;

    public SimuladorViagemController(SimuladorViagemService simuladorViagemService) {
        this.simuladorViagemService = simuladorViagemService;
    }

    @PostMapping("/calcular")
    public SimuladorResponse calcular(@Valid @RequestBody SimuladorRequest request) {
        return simuladorViagemService.calcular(request);
    }

    @GetMapping
    public List<SimuladorResponse> listarSimulacoes() {
        return simuladorViagemService.listarSimulacoes();
    }

    @GetMapping("/{id}")
    public SimuladorResponse buscarSimulacao(@PathVariable Long id) {
        return simuladorViagemService.buscarSimulacao(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerSimulacao(@PathVariable Long id) {
        simuladorViagemService.removerSimulacao(id);
    }
}
