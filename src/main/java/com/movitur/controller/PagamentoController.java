package com.movitur.controller;

import com.movitur.dto.PagamentoRequest;
import com.movitur.dto.PagamentoResponse;
import com.movitur.service.PagamentoService;
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
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    public PagamentoController(PagamentoService pagamentoService) {
        this.pagamentoService = pagamentoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagamentoResponse pagar(@Valid @RequestBody PagamentoRequest request) {
        return pagamentoService.pagar(request);
    }

    @GetMapping
    public List<PagamentoResponse> listarMinhas() {
        return pagamentoService.listarMinhas();
    }

    @GetMapping("/reserva/{reservaId}")
    public List<PagamentoResponse> listarPorReserva(@PathVariable Long reservaId) {
        return pagamentoService.listarPorReserva(reservaId);
    }
}
