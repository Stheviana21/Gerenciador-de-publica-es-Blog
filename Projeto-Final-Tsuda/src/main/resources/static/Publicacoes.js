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
    // Pegar valores dos campos
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data = document.getElementById('data').value;
    const conteudo = document.getElementById('conteudo').value;
    
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
            <p><strong>Data:</strong> ${publicacao.dataPublicacao}</p>
            <p>${publicacao.conteudo}</p>
            <div class="botoes">
                <button class="botao-alterar" onclick="editarPublicacao(${publicacao.id})">Alterar</button>
                <button class="botao-excluir" onclick="excluirPublicacao(${publicacao.id})">Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Função para editar (por enquanto só redireciona)
function editarPublicacao(id) {
    alert('Editar publicação ' + id);
    // Aqui você pode redirecionar para página de edição
    // window.location.href = 'editar.html?id=' + id;
}

// Função para ir para página de adicionar
function irParaAddTexto() {
    window.location.href = 'addtexto.html';
}

// Função para voltar para lista
function voltarParaLista() {
    window.location.href = 'index.html';
}

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Se estiver na página principal, mostrar publicações
    if (document.getElementById('lista-publicacoes')) {
        mostrarPublicacoes();
    }
    
    // Se estiver na página de adicionar, configurar o botão salvar
    const form = document.getElementById('form-publicacao');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            salvarPublicacao();
        });
    }
});