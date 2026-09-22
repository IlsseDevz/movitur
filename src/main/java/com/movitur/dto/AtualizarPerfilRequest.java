package com.movitur.dto;

import jakarta.validation.constraints.Size;

public class AtualizarPerfilRequest {

    @Size(max = 20, message = "O telefone nao pode exceder 20 caracteres.")
    private String telefone;

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
