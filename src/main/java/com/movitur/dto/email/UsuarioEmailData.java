package com.movitur.dto.email;

import com.movitur.entity.Usuario;

public record UsuarioEmailData(
        String nomeCompleto,
        String email
) {
    public static UsuarioEmailData from(Usuario usuario) {
        return new UsuarioEmailData(usuario.getNomeCompleto(), usuario.getEmail());
    }
}
