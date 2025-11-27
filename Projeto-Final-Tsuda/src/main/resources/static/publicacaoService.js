const API_URL = 'http://localhost:8080/api/publicacoes';

// Função para carregar publicações da API
async function carregarPublicacoes() {
    try {
        const response = await fetch(API_URL);
        const publicacoes = await response.json();
        return publicacoes;
    } catch (error) {
        console.log('Erro ao carregar:', error);
        return [];
    }
}

// Função para salvar nova publicação
async function salvarPublicacao() {
    console.log('salvarPublicacao executando...');
    
    // Pegar valores dos campos
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data = document.getElementById('data').value;
    const conteudo = document.getElementById('conteudo').value;
    
    console.log('Dados a serem salvos:', { titulo, autor, data, conteudo });
    
    // Criar objeto da publicação
    const novaPublicacao = {
        titulo: titulo,
        autor: autor,
        dataPublicacao: data,
        conteudo: conteudo,
        publicado: true
    };
    
    try {
        // Enviar para API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaPublicacao)
        });
        
        if (response.ok) {
            alert('Publicação salva com sucesso!');
            // Voltar para página principal
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert('Erro ao salvar: ' + error.message);
    }
}

// Função para excluir publicação
async function excluirPublicacao(id) {
    if (confirm('Tem certeza que quer excluir?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            alert('Excluído com sucesso!');
            // Recarregar a lista
            mostrarPublicacoes();
        } catch (error) {
            alert('Erro ao excluir: ' + error.message);
        }
    }
}

// Função para mostrar publicações na tela
async function mostrarPublicacoes() {
    const container = document.getElementById('lista-publicacoes');
    if (!container) return;
    
    const publicacoes = await carregarPublicacoes();
    
    container.innerHTML = '';
    
    publicacoes.forEach(publicacao => {
        const div = document.createElement('div');
        div.className = 'publicacao';
        div.innerHTML = `
            <h3>${publicacao.titulo}</h3>
            <p><strong>Autor:</strong> ${publicacao.autor}</p>
            <p><strong>Publicado em:</strong> ${publicacao.dataPublicacao}</p>
            ${!publicacao.publicado ? '<span class="marcador-nao-publicado">NÃO PUBLICADO</span>' : ''}
            <p>${publicacao.conteudo}</p>
            <div class="botoes">
                <button class="botao-alterar" data-id="${publicacao.id}">Alterar</button>
                <button class="botao-excluir" data-id="${publicacao.id}">Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Função para editar
function editarPublicacao(id) {
    alert('Editando publicação: ' + id);
    // window.location.href = '/editar-publicacao?id=' + id;
}

// Função para voltar para lista
function voltarParaLista() {
    window.location.href = 'index.html';
}

// Event delegation para os botões - UMA VEZ só
document.addEventListener('click', function(event) {
    // Se clicou em botão excluir
    if (event.target.classList.contains('botao-excluir')) {
        const id = event.target.getAttribute('data-id');
        excluirPublicacao(id);
    }
    
    // Se clicou em botão alterar
    if (event.target.classList.contains('botao-alterar')) {
        const id = event.target.getAttribute('data-id');
        editarPublicacao(id);
    }
});

// Event delegation para o formulário - UMA VEZ só
document.addEventListener('submit', function(event) {
    if (event.target.id === 'form-publicacao') {
        event.preventDefault();
        console.log('Formulário submetido (uma vez)');
        salvarPublicacao();
    }
});

// Carregamento inicial SIMPLES - sem DOMContentLoaded
if (document.getElementById('lista-publicacoes')) {
    console.log('Carregando publicações...');
    mostrarPublicacoes();
}