package com.movitur.controller;

import com.movitur.dto.FavoritoIdsResponse;
import com.movitur.dto.FavoritoRequest;
import com.movitur.dto.FavoritoResponse;
import com.movitur.entity.TipoFavorito;
import com.movitur.service.FavoritoService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public List<FavoritoResponse> listar() {
        return favoritoService.listarMinhas();
    }

    @GetMapping("/ids")
    public FavoritoIdsResponse listarIds() {
        return favoritoService.listarIds();
    }

    @GetMapping("/{tipo}/{itemId}")
    public Map<String, Boolean> verificar(@PathVariable TipoFavorito tipo, @PathVariable Long itemId) {
        return Map.of("favorito", favoritoService.isFavorito(tipo, itemId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FavoritoResponse adicionar(@Valid @RequestBody FavoritoRequest request) {
        return favoritoService.adicionar(request);
    }

    @DeleteMapping("/{tipo}/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable TipoFavorito tipo, @PathVariable Long itemId) {
        favoritoService.remover(tipo, itemId);
    }
}
