package com.movitur.controller;

import com.movitur.dto.ReservaResponse;
import com.movitur.entity.StatusReserva;
import com.movitur.service.ReservaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservas")
public class ReservaAdminController {

    private final ReservaService reservaService;

    public ReservaAdminController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public List<ReservaResponse> listar(@RequestParam(required = false) StatusReserva status) {
        return reservaService.listarTodas(status);
    }

    @PutMapping("/{id}/confirmar")
    public ReservaResponse confirmar(@PathVariable Long id) {
        return reservaService.confirmar(id);
    }

    @PutMapping("/{id}/rejeitar")
    public ReservaResponse rejeitar(@PathVariable Long id) {
        return reservaService.rejeitar(id);
    }

    @PutMapping("/{id}/cancelar")
    public ReservaResponse cancelar(@PathVariable Long id) {
        return reservaService.cancelarAdmin(id);
    }
}
