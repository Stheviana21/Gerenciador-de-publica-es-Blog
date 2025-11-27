package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BlogController {

    @GetMapping("/")
    public String listaPublicacoes() {
        return "index.html";
    }

    @GetMapping("/nova-publicacao")
    public String novaPublicacao() {
        return "redirect:/addtexto.html";
    }
}