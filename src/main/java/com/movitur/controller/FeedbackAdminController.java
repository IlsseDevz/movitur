package com.movitur.controller;

import com.movitur.dto.FeedbackResponse;
import com.movitur.dto.FeedbackResumoResponse;
import com.movitur.service.FeedbackService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/feedback")
public class FeedbackAdminController {

    private final FeedbackService feedbackService;

    public FeedbackAdminController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public List<FeedbackResponse> listarTodos() {
        return feedbackService.listarTodosAdmin();
    }

    @GetMapping("/resumo")
    public FeedbackResumoResponse resumo() {
        return feedbackService.resumo();
    }
}
