package com.movitur.controller;

import com.movitur.dto.ReservaRequest;
import com.movitur.dto.ReservaResponse;
import com.movitur.service.ReservaService;
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
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaResponse criar(@Valid @RequestBody ReservaRequest request) {
        return reservaService.criar(request);
    }

    @GetMapping
    public List<ReservaResponse> listarMinhas() {
        return reservaService.listarMinhas();
    }

    @GetMapping("/{id}")
    public ReservaResponse buscar(@PathVariable Long id) {
        return reservaService.buscarMinha(id);
    }

    @PutMapping("/{id}/cancelar")
    public ReservaResponse cancelar(@PathVariable Long id) {
        return reservaService.cancelar(id);
    }
}
