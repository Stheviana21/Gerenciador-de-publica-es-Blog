package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublicacaoService {

    @Autowired
    private PublicacaoRepository publicacaoRepository;

    public List<Publicacao> findAll() {
        return publicacaoRepository.findAll();
    }

    public Publicacao save(Publicacao publicacao) {
        return publicacaoRepository.save(publicacao);
    }

    public Publicacao findById(Long id) {
        Optional<Publicacao> publicacao = publicacaoRepository.findById(id);
        return publicacao.orElse(null); // Retorna null se não encontrar
    }

    public Publicacao update(Long id, Publicacao publicacaoAtualizada) {
        Optional<Publicacao> publicacaoExistente = publicacaoRepository.findById(id);

        if (publicacaoExistente.isPresent()) {
            Publicacao publicacao = publicacaoExistente.get();
            publicacao.setTitulo(publicacaoAtualizada.getTitulo());
            publicacao.setAutor(publicacaoAtualizada.getAutor());
            publicacao.setDataPublicacao(publicacaoAtualizada.getDataPublicacao());
            publicacao.setConteudo(publicacaoAtualizada.getConteudo());
            publicacao.setPublicado(publicacaoAtualizada.isPublicado());

            return publicacaoRepository.save(publicacao);
        } else {
            throw new RuntimeException("Publicação não encontrada com id: " + id);
        }
    }

    public void delete(Long id) {
        publicacaoRepository.deleteById(id);
    }

}
