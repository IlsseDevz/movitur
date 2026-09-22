package com.movitur.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping("/login")
    public String login() {
        return "redirect:/cliente/login";
    }

    @GetMapping("/registo")
    public String registo() {
        return "redirect:/cliente/registo";
    }

    @GetMapping("/categorias")
    public String categorias() {
        return "redirect:/cliente/categorias";
    }

    @GetMapping("/destinos")
    public String destinos() {
        return "redirect:/cliente/destinos";
    }

    @GetMapping("/guias")
    public String guias() {
        return "redirect:/cliente/guias";
    }

    @GetMapping("/simulador")
    public String simulador() {
        return "redirect:/cliente/simulador";
    }

    @GetMapping({"/painel", "/painel/"})
    public String painel() {
        return "redirect:/cliente/inicio";
    }
}
