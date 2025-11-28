package com.example.demo;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private PublicacaoRepository publicacaoRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== INICIANDO DATALOADER ===");
        
        long count = publicacaoRepository.count();
        System.out.println("Quantidade de publicações no banco: " + count);
        
        // Só adiciona dados se estiver vazio
        if (count == 0) {
            System.out.println("Banco vazio! Carregando dados iniciais...");
            
            Publicacao pub1 = new Publicacao();
            pub1.setTitulo("Como estudar programação");
            pub1.setAutor("Sthephany Viana ");
            pub1.setDataPublicacao(new Date());
            pub1.setConteudo("Veja neste texto dicas de como programar");
            pub1.setPublicado(true);

            Publicacao pub2 = new Publicacao();
            pub2.setTitulo("20 Dicas para falar bem");
            pub2.setAutor("Ana Julia Ferrreira");
            pub2.setDataPublicacao(new Date());
            pub2.setConteudo("Aqui estão 20 dicas para você falar melhor em público");
            pub2.setPublicado(false);

            publicacaoRepository.save(pub1);
            publicacaoRepository.save(pub2);

            System.out.println(" Dados iniciais carregados no H2!");
            System.out.println("Agora temos " + publicacaoRepository.count() + " publicações");
        } else {
            System.out.println("Banco já contém " + count + " publicações");
        }
        
        System.out.println("=== DATALOADER FINALIZADO ===");
    }
}