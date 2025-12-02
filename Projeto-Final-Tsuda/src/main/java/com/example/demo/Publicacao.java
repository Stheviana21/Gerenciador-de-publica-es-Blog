package com.example.demo;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity  
@Table(name="publicacoes")
public class Publicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Título é obrigatório")
    @Size(min = 5, max = 100, message = "Título deve ter entre 5 e 100 caracteres") 
    @Column(nullable = false)
    private String titulo;
    
    @NotBlank(message = "Autor é obrigatório") 
    @Size(min = 3, max = 50, message = "Autor deve ter entre 3 e 50 caracteres") 
    @Column(nullable = false)
    private String autor;
    
    @NotNull(message = "Data de publicação é obrigatória") 
    @Column(name = "data_publicacao")
    private Date dataPublicacao;
    
    @NotBlank(message = "Conteúdo é obrigatório") 
    @Size(min = 10, message = "Conteúdo deve ter no mínimo 10 caracteres") 
    @Column(columnDefinition = "TEXT")
    private String conteudo;
    
    private boolean publicado;

    public Publicacao() {}

    public Publicacao(String titulo, String autor, Date dataPublicacao, String conteudo, boolean publicado) {
        this.titulo = titulo;
        this.autor = autor;
        this.dataPublicacao = dataPublicacao;
        this.conteudo = conteudo;
        this.publicado = publicado;
    }
    
    // Getters e Setters (mantenha iguais)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    
    public Date getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(Date dataPublicacao) { this.dataPublicacao = dataPublicacao; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    
    public boolean isPublicado() { return publicado; }
    public void setPublicado(boolean publicado) { this.publicado = publicado; }
}