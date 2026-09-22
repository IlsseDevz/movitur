package com.movitur.controller;

import com.movitur.dto.GuiaTuristicoRequest;
import com.movitur.dto.GuiaTuristicoResponse;
import com.movitur.service.GuiaTuristicoService;
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
@RequestMapping("/api/guias")
public class GuiaTuristicoController {

    private final GuiaTuristicoService guiaTuristicoService;

    public GuiaTuristicoController(GuiaTuristicoService guiaTuristicoService) {
        this.guiaTuristicoService = guiaTuristicoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GuiaTuristicoResponse criar(@Valid @RequestBody GuiaTuristicoRequest request) {
        return guiaTuristicoService.criar(request);
    }

    @GetMapping
    public List<GuiaTuristicoResponse> listar(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) Long destinoId) {
        return guiaTuristicoService.listar(ativo, destinoId);
    }

    @GetMapping("/{id}")
    public GuiaTuristicoResponse buscarPorId(@PathVariable Long id) {
        return guiaTuristicoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public GuiaTuristicoResponse atualizar(@PathVariable Long id, @Valid @RequestBody GuiaTuristicoRequest request) {
        return guiaTuristicoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        guiaTuristicoService.remover(id);
    }
}
