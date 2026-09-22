package com.movitur.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> TIPOS_PERMITIDOS = Set.of("destinos", "guias");
    private static final Set<String> CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_BYTES = 5 * 1024 * 1024;

    private final Path uploadRoot;

    public FileStorageService(@Value("${movitur.upload.dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Nao foi possivel criar a pasta de uploads", e);
        }
    }

    public String guardarImagem(MultipartFile file, String tipo) {
        validarTipo(tipo);
        validarFicheiro(file);

        String extensao = extensaoDe(file);
        String nomeFicheiro = UUID.randomUUID() + extensao;
        Path destino = uploadRoot.resolve(tipo).resolve(nomeFicheiro);

        try {
            Files.createDirectories(destino.getParent());
            file.transferTo(destino);
        } catch (IOException e) {
            throw new IllegalArgumentException("Erro ao guardar a imagem");
        }

        return "/uploads/" + tipo + "/" + nomeFicheiro;
    }

    private void validarTipo(String tipo) {
        if (tipo == null || !TIPOS_PERMITIDOS.contains(tipo.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Tipo de upload invalido. Use: destinos ou guias");
        }
    }

    private void validarFicheiro(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Nenhum ficheiro enviado");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("A imagem deve ter no maximo 5 MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Formato nao suportado. Use JPEG, PNG, WebP ou GIF");
        }
    }

    private String extensaoDe(MultipartFile file) {
        String contentType = file.getContentType().toLowerCase(Locale.ROOT);
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }
}
