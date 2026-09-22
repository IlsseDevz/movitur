package com.movitur.controller;

import com.movitur.dto.RelatorioResumoResponse;
import com.movitur.service.RelatorioAdminService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin/relatorios")
public class RelatorioAdminController {

    private final RelatorioAdminService relatorioAdminService;

    public RelatorioAdminController(RelatorioAdminService relatorioAdminService) {
        this.relatorioAdminService = relatorioAdminService;
    }

    @GetMapping("/resumo")
    public RelatorioResumoResponse resumo() {
        return relatorioAdminService.resumo();
    }

    @GetMapping("/reservas.csv")
    public ResponseEntity<byte[]> exportarReservas() {
        return csvResponse(relatorioAdminService.exportarReservasCsv(), "movitur-reservas.csv");
    }

    @GetMapping("/pagamentos.csv")
    public ResponseEntity<byte[]> exportarPagamentos() {
        return csvResponse(relatorioAdminService.exportarPagamentosCsv(), "movitur-pagamentos.csv");
    }

    private ResponseEntity<byte[]> csvResponse(byte[] data, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(data);
    }
}
