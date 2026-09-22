package com.movitur.controller;

import com.movitur.dto.FeedbackRequest;
import com.movitur.dto.FeedbackResponse;
import com.movitur.dto.FeedbackResumoResponse;
import com.movitur.entity.TipoFeedbackAlvo;
import com.movitur.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackResponse criar(@Valid @RequestBody FeedbackRequest request) {
        return feedbackService.criar(request);
    }

    @GetMapping("/recentes")
    public List<FeedbackResponse> listarRecentes() {
        return feedbackService.listarRecentes();
    }

    @GetMapping("/publicos")
    public List<FeedbackResponse> listarPorEntidade(
            @RequestParam TipoFeedbackAlvo tipoAlvo,
            @RequestParam Long entidadeId) {
        return feedbackService.listarPorEntidade(tipoAlvo, entidadeId);
    }

    @GetMapping("/resumo")
    public FeedbackResumoResponse resumoPorEntidade(
            @RequestParam TipoFeedbackAlvo tipoAlvo,
            @RequestParam Long entidadeId) {
        return feedbackService.resumoPorEntidade(tipoAlvo, entidadeId);
    }
}
