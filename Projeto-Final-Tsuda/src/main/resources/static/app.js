// app.js - ARQUIVO ÚNICO PARA AMBAS AS PÁGINAS
const API_URL = 'http://localhost:8080/api/publicacoes';
let salvando = false;

// ========== FUNÇÕES PARA INDEX.HTML ==========

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

// Função para verificar se a publicação é futura
function isPublicacaoFutura(dataPublicacao) {
    const dataPub = new Date(dataPublicacao);
    const hoje = new Date();
    
    hoje.setHours(0, 0, 0, 0);
    dataPub.setHours(0, 0, 0, 0);
    
    return dataPub > hoje;
}

// Função para mostrar publicações na tela (INDEX.HTML)
async function mostrarPublicacoes() {
    const container = document.getElementById('lista-publicacoes');
    if (!container) return;
    
    const publicacoes = await carregarPublicacoes();
    
    container.innerHTML = '';
    
    publicacoes.forEach(publicacao => {
        const div = document.createElement('div');
        div.className = 'publicacao';
        
        const isNaoPublicado = isPublicacaoFutura(publicacao.dataPublicacao);
        
        if (isNaoPublicado) {
            div.classList.add("nao-publicado");
        }

        div.innerHTML = `
            <h3>${publicacao.titulo}</h3>
            <p><strong>Autor:</strong> ${publicacao.autor}</p>
            <p><strong>Publicado em:</strong> ${new Date(publicacao.dataPublicacao).toLocaleDateString("pt-BR")}</p>
            ${isNaoPublicado ? '<span class="marcador-nao-publicado">NÃO PUBLICADO</span>' : ''}
            <p>${publicacao.conteudo}</p>
            <div class="botoes">
                <button class="botao-alterar" data-id="${publicacao.id}">Alterar</button>
                <button class="botao-excluir" data-id="${publicacao.id}">Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Função para excluir publicação
async function excluirPublicacao(id) {
    if (confirm('Tem certeza que quer excluir?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            alert('Excluído com sucesso!');
            mostrarPublicacoes();
        } catch (error) {
            alert('Erro ao excluir: ' + error.message);
        }
    }
}

// ========== FUNÇÕES PARA ADDTEXTO.HTML ==========

// Função para voltar para lista
function voltarParaLista() {
    window.location.href = 'index.html';
}

// Função para verificar modo edição (ADDTEXTO.HTML)
function verificarModoEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        document.getElementById('titulo-formulario').textContent = 'Alterar Publicação';
        document.getElementById('botao-salvar').textContent = 'Salvar Alterações';
        carregarDadosPublicacao(id);
    }
}

// Função para carregar dados da publicação (ADDTEXTO.HTML)
async function carregarDadosPublicacao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Publicação não encontrada');
        
        const publicacao = await response.json();
        
        document.getElementById('titulo').value = publicacao.titulo;
        document.getElementById('autor').value = publicacao.autor;
        document.getElementById('data').value = publicacao.dataPublicacao;
        document.getElementById('conteudo').value = publicacao.conteudo;
        
    } catch (error) {
        console.error('Erro ao carregar:', error);
        alert('Erro ao carregar dados da publicação');
    }
}

// Função para salvar publicação (ADDTEXTO.HTML)
async function salvarPublicacao() {
    if (salvando) return;
    salvando = true;
    
    try {
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const data = document.getElementById('data').value;
        const conteudo = document.getElementById('conteudo').value;
        
        // Validar campos
        if (!titulo || !autor || !data || !conteudo) {
            alert('Preencha todos os campos!');
            salvando = false;
            return;
        }

        if (conteudo.length < 10) {
            alert('O texto deve ter no mínimo 10 caracteres!');
            salvando = false;
            return;
        }
        
        const publicacao = {
            titulo: titulo,
            autor: autor,
            dataPublicacao: data,
            conteudo: conteudo,
            publicado: true
        };
        
        // Verificar se é edição ou criação
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        let response;
        if (id) {
            // EDIÇÃO - PUT
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacao)
            });
        } else {
            // CRIAÇÃO - POST
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacao)
            });
        }
        
        if (response.ok) {
            const mensagem = id ? 'Publicação atualizada com sucesso!' : 'Publicação salva com sucesso!';
            alert(mensagem);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            throw new Error('Erro: ' + response.status);
        }
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar: ' + error.message);
    } finally {
        salvando = false;
    }
}

// ========== INICIALIZAÇÃO PARA AMBAS PÁGINAS ==========

function inicializarApp() {
    console.log('🚀 Inicializando aplicação...');
    
    // EVENTOS PARA INDEX.HTML
    if (document.getElementById('lista-publicacoes')) {
        console.log('📝 Carregando publicações...');
        mostrarPublicacoes();
        
        // Event delegation para botões
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('botao-excluir')) {
                const id = event.target.getAttribute('data-id');
                excluirPublicacao(id);
            }
            
            if (event.target.classList.contains('botao-alterar')) {
                const id = event.target.getAttribute('data-id');
                window.location.href = `addtexto.html?id=${id}`;
            }
        });
    }
    
    // EVENTOS PARA ADDTEXTO.HTML
    if (document.getElementById('form-publicacao')) {
        console.log('📋 Inicializando formulário...');
        verificarModoEdicao();
        
        document.getElementById('form-publicacao').addEventListener('submit', function(event) {
            event.preventDefault();
            salvarPublicacao();
        });
    }
}

// Iniciar a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}