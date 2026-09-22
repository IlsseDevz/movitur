package com.movitur.controller;

import com.movitur.dto.CategoriaRequest;
import com.movitur.dto.CategoriaResponse;
import com.movitur.entity.TipoExperiencia;
import com.movitur.service.CategoriaService;
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
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse criar(@Valid @RequestBody CategoriaRequest request) {
        return categoriaService.criar(request);
    }

    @GetMapping
    public List<CategoriaResponse> listar(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) TipoExperiencia tipoExperiencia) {
        return categoriaService.listar(ativo, tipoExperiencia);
    }

    @GetMapping("/{id}")
    public CategoriaResponse buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return categoriaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        categoriaService.remover(id);
    }
}
