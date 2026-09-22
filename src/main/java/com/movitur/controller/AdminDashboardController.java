package com.movitur.controller;

import com.movitur.service.ReservaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final ReservaService reservaService;

    public AdminDashboardController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of("reservasPendentes", reservaService.contarPendentes());
    }
}
