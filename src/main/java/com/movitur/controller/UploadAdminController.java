package com.movitur.controller;

import com.movitur.dto.UploadResponse;
import com.movitur.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/upload")
public class UploadAdminController {

    private final FileStorageService fileStorageService;

    public UploadAdminController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UploadResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipo") String tipo) {
        String url = fileStorageService.guardarImagem(file, tipo);
        return new UploadResponse(url);
    }
}
