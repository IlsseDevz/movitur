package com.movitur.dto;

import com.movitur.entity.Usuario;

import java.time.LocalDateTime;

public class UsuarioResponse {

    private Long id;
    private String nomeCompleto;
    private String email;
    private String telefone;
    private String role;
    private String status;
    private LocalDateTime criadoEm;

    public static UsuarioResponse fromEntity(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.id = u.getId();
        r.nomeCompleto = u.getNomeCompleto();
        r.email = u.getEmail();
        r.telefone = u.getTelefone();
        r.role = u.getRole().name();
        r.status = u.getStatus().name();
        r.criadoEm = u.getCriadoEm();
        return r;
    }

    public Long getId() {
        return id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
