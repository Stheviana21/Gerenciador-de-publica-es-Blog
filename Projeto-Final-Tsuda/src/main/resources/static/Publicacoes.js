// publicacoes.js

const API_URL = 'http://localhost:8080/api/publicacoes';

class PublicacaoService {
    
    // Buscar todas as publicações
    async carregarPublicacoes() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erro ao carregar publicações');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    }
    
    // Criar nova publicação
    async criarPublicacao(publicacao) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(publicacao)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao criar publicação');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
    
    // Atualizar publicação
    async atualizarPublicacao(id, publicacao) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(publicacao)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao atualizar publicação');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
    
    // Excluir publicação
    async excluirPublicacao(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir publicação');
            }
            
            return true;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
}

// Instância do serviço
const publicacaoService = new PublicacaoService();

// Função para carregar e exibir publicações
async function carregarEExibirPublicacoes() {
    const publicacoes = await publicacaoService.carregarPublicacoes();
    const container = document.getElementById('lista-publicacoes');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    publicacoes.forEach((publicacao, index) => {
        const publicacaoElement = criarElementoPublicacao(publicacao, index);
        container.appendChild(publicacaoElement);
    });
}

// Função para criar elemento HTML da publicação
function criarElementoPublicacao(publicacao, index) {
    const div = document.createElement('div');
    div.className = 'publicacao';
    div.innerHTML = `
        <h3>${publicacao.titulo}</h3>
        <p><strong>Autor:</strong> ${publicacao.autor}</p>
        <p><strong>Publicado em:</strong> ${formatarData(publicacao.dataPublicacao)}</p>
        ${!publicacao.publicado ? '<span class="marcador-nao-publicado">NÃO PUBLICADO</span>' : ''}
        <p>${publicacao.conteudo}</p>
        <div class="botoes">
            <button class="botao-alterar" onclick="editarPublicacao(${publicacao.id})">Alterar</button>
            <button class="botao-excluir" onclick="excluirPublicacao(${publicacao.id})">Excluir</button>
        </div>
    `;
    
    return div;
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para salvar nova publicação
async function salvarPublicacao(event) {
    event.preventDefault();
    
    const publicacao = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        dataPublicacao: document.getElementById('data').value,
        conteudo: document.getElementById('conteudo').value,
        publicado: document.getElementById('publicado').checked
    };
    
    try {
        await publicacaoService.criarPublicacao(publicacao);
        alert('Publicação salva com sucesso!');
        window.location.href = '/'; // Volta para a lista
    } catch (error) {
        alert('Erro ao salvar publicação: ' + error.message);
    }
}

// Função para excluir publicação
async function excluirPublicacao(id) {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
        try {
            await publicacaoService.excluirPublicacao(id);
            alert('Publicação excluída com sucesso!');
            carregarEExibirPublicacoes();
        } catch (error) {
            alert('Erro ao excluir publicação: ' + error.message);
        }
    }
}

// Função para editar publicação (redireciona para formulário de edição)
function editarPublicacao(id) {
    window.location.href = `/editar-publicacao.html?id=${id}`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Se estiver na página de lista, carrega as publicações
    if (document.getElementById('lista-publicacoes')) {
        carregarEExibirPublicacoes();
    }
    
    // Se estiver no formulário, configura o submit
    const form = document.getElementById('form-publicacao');
    if (form) {
        form.addEventListener('submit', salvarPublicacao);
    }
});