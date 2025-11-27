package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publicacoes")
public class PublicacaoController {

    @Autowired
    private PublicacaoService publicacaoService; // Corrigido: "PublicacaoService" com P maiúsculo

    @GetMapping
    public List<Publicacao> getAllPublicacoes() {
        return publicacaoService.findAll();
    }

    @PostMapping
    public Publicacao createPublicacao(@RequestBody Publicacao publicacao) {
        return publicacaoService.save(publicacao);
    }

    @PutMapping("/{id}")
    public Publicacao updatePublicacao(@PathVariable Long id, @RequestBody Publicacao publicacao) {
        return publicacaoService.update(id, publicacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePublicacao(@PathVariable Long id) {
        publicacaoService.delete(id);
        return ResponseEntity.ok().build();
    }
}