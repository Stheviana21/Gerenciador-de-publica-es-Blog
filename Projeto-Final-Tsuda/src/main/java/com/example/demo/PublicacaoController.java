package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")
public class PublicacaoController {

    @Autowired 
    private PublicacaoService publicacaoService; 

    @GetMapping
    public List<Publicacao> getAllPublicacoes() {
        return publicacaoService.findAll();
    }

    @GetMapping("/{id}") //buscando por id 
    public ResponseEntity<Publicacao> getPublicacaoById(@PathVariable Long id) {
        Publicacao publicacao = publicacaoService.findById(id);
        if (publicacao != null) {
            return ResponseEntity.ok(publicacao);
        } else {
            return ResponseEntity.notFound().build();
        }
    } 

    @PostMapping //salvando
    public Publicacao createPublicacao(@RequestBody Publicacao publicacao) {
        return publicacaoService.save(publicacao);
    }

    @PutMapping("/{id}") //editando
    public Publicacao updatePublicacao(@PathVariable Long id, @RequestBody Publicacao publicacao) {
        return publicacaoService.update(id, publicacao);
    }

    @DeleteMapping("/{id}") //deletando
    public ResponseEntity<?> deletePublicacao(@PathVariable Long id) {
        publicacaoService.delete(id);
        return ResponseEntity.ok().build();
    }
}