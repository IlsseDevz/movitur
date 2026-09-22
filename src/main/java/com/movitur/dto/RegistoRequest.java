package com.movitur.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegistoRequest {

    @NotBlank(message = "O nome completo e obrigatorio")
    @Size(max = 150)
    private String nomeCompleto;

    @NotBlank(message = "O email e obrigatorio")
    @Email(message = "Email invalido")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "A senha e obrigatoria")
    @Size(min = 6, max = 100, message = "A senha deve ter entre 6 e 100 caracteres")
    private String senha;

    @Size(max = 20)
    private String telefone;

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
