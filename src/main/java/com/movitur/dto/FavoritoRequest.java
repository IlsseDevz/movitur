package com.movitur.dto;

import com.movitur.entity.TipoFavorito;
import jakarta.validation.constraints.NotNull;

public class FavoritoRequest {

    @NotNull(message = "O tipo e obrigatorio.")
    private TipoFavorito tipo;

    @NotNull(message = "O item e obrigatorio.")
    private Long itemId;

    public TipoFavorito getTipo() {
        return tipo;
    }

    public void setTipo(TipoFavorito tipo) {
        this.tipo = tipo;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }
}
