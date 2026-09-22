package com.movitur.controller;

import com.movitur.dto.PagamentoRejeicaoRequest;
import com.movitur.dto.PagamentoResponse;
import com.movitur.entity.StatusVerificacaoPagamento;
import com.movitur.service.PagamentoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pagamentos")
public class PagamentoAdminController {

    private final PagamentoService pagamentoService;

    public PagamentoAdminController(PagamentoService pagamentoService) {
        this.pagamentoService = pagamentoService;
    }

    @GetMapping
    public List<PagamentoResponse> listar(
            @RequestParam(required = false) StatusVerificacaoPagamento status) {
        return pagamentoService.listarTodosAdmin(status);
    }

    @PutMapping("/{id}/confirmar")
    public PagamentoResponse confirmar(@PathVariable Long id) {
        return pagamentoService.confirmarAdmin(id);
    }

    @PutMapping("/{id}/rejeitar")
    public PagamentoResponse rejeitar(
            @PathVariable Long id,
            @RequestBody(required = false) PagamentoRejeicaoRequest request) {
        String motivo = request != null ? request.getMotivo() : null;
        return pagamentoService.rejeitarAdmin(id, motivo);
    }
}
