package com.movitur.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RedefinirSenhaRequest {

    @NotBlank(message = "O token e obrigatorio.")
    private String token;

    @NotBlank(message = "A nova senha e obrigatoria.")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    private String novaSenha;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
