package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/publicacoes")
@CrossOrigin(origins = "*")
@Validated 
public class PublicacaoController {

    @Autowired 
    private PublicacaoService publicacaoService; 

    @GetMapping
    public List<Publicacao> getAllPublicacoes() {
        return publicacaoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacao> getPublicacaoById( @PathVariable Long id) {
        Publicacao publicacao = publicacaoService.findById(id);
        if (publicacao != null) {
            return ResponseEntity.ok(publicacao);
        } else {
            return ResponseEntity.notFound().build();
        }
    }  

    @PostMapping
    public ResponseEntity<?> createPublicacao(@Valid @RequestBody Publicacao publicacao) {
        
        try {
            Publicacao saved = publicacaoService.save(publicacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePublicacao(@PathVariable Long id, 
                                              @Valid @RequestBody Publicacao publicacao) {
        
        try {
            Publicacao updated = publicacaoService.update(id, publicacao);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePublicacao(@PathVariable Long id) {
        publicacaoService.delete(id);
        return ResponseEntity.ok().build();
    }
}