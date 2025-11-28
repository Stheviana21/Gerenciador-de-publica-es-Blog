// app.js - ARQUIVO ÚNICO PARA AMBAS AS PÁGINAS
const API_URL = 'http://localhost:8080/api/publicacoes'; // CORRIGIDO: use '/blog' em vez de '/api/publicacoes'
let salvando = false;
let postAtualId = null;

// ========== FUNÇÕES PARA INDEX.HTML ==========

// Função para carregar publicações da API
async function carregarPublicacoes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar publicações');
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
            <p>${publicacao.texto}</p> <!-- CORRIGIDO: use 'texto' em vez de 'conteudo' -->
            <div class="botoes">
                <button class="botao-alterar" data-id="${publicacao.id}">Alterar</button>
                <button class="botao-excluir" data-id="${publicacao.id}">Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Adicionar event listeners aos botões após criar os elementos
    adicionarEventListeners();
}

// Função para adicionar event listeners aos botões
function adicionarEventListeners() {
    document.querySelectorAll('.botao-excluir').forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            excluirPublicacao(id);
        });
    });

    document.querySelectorAll('.botao-alterar').forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            window.location.href = `addtexto.html?id=${id}`;
        });
    });
}

// Função para excluir publicação
async function excluirPublicacao(id) {
    if (confirm('Tem certeza que quer excluir?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Excluído com sucesso!');
                mostrarPublicacoes();
            } else {
                throw new Error('Erro ao excluir: ' + response.status);
            }
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

// Função para carregar dados da publicação (ADDTEXTO.HTML)
async function carregarDadosPublicacao(id) {
    try {
        console.log('Carregando dados para ID:', id);
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) throw new Error('Publicação não encontrada');

        const publicacao = await response.json();
        console.log('Dados recebidos:', publicacao);

        // Preencher formulário com os dados
        document.getElementById('titulo').value = publicacao.titulo;
        document.getElementById('autor').value = publicacao.autor;
        
        // Formatar data para o input (yyyy-MM-dd)
        const dataPublicacao = new Date(publicacao.dataPublicacao);
        const dataFormatada = dataPublicacao.toISOString().split('T')[0];
        document.getElementById('data').value = dataFormatada;
        
        document.getElementById('conteudo').value = publicacao.texto; // CORRIGIDO: use 'texto'

        // Atualizar interface para modo edição
        document.getElementById('titulo-formulario').textContent = `Alterar Publicação - ID ${id}`;
        document.getElementById('botao-salvar').textContent = 'Salvar Alterações';

        postAtualId = id;
        
        console.log('Formulário preenchido com sucesso!');

    } catch (error) {
        console.error('Erro ao carregar:', error);
        alert('Erro ao carregar dados da publicação: ' + error.message);
    }
}

// Função para verificar modo edição (ADDTEXTO.HTML)
function verificarModoEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    console.log('Verificando modo edição, ID:', id);

    if (id) {
        carregarDadosPublicacao(id);
    } else {
        // Modo criação - garantir que está limpo
        document.getElementById('titulo-formulario').textContent = 'Incluir nova publicação';
        document.getElementById('botao-salvar').textContent = 'Salvar';
        document.getElementById('form-publicacao').reset();
    }
}

// Função para salvar publicação (ADDTEXTO.HTML)
async function salvarPublicacao() {
    if (salvando) {
        console.log('Já está salvando...');
        return;
    }
    
    salvando = true;
    console.log('Iniciando salvamento...');

    try {
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const data = document.getElementById('data').value;
        const conteudo = document.getElementById('conteudo').value;

        console.log('Dados do formulário:', { titulo, autor, data, conteudo });

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
            texto: conteudo // CORRIGIDO: use 'texto' em vez de 'conteudo'
        };

        // Verificar se é edição ou criação
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        let url = API_URL;
        let method = 'POST';

        if (id) {
            // EDIÇÃO - PUT
            url = `${API_URL}/${id}`;
            method = 'PUT';
            publicacao.id = parseInt(id); // Adicionar ID para edição
        }

        console.log('Enviando para API:', { method, url, publicacao });

        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(publicacao)
        });

        console.log('Resposta da API:', response.status);

        if (response.ok) {
            const publicacaoSalva = await response.json();
            const mensagem = id ? 'Publicação atualizada com sucesso!' : 'Publicação salva com sucesso!';
            alert(mensagem);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } else {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
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
        console.log('📝 Carregando publicações para index.html...');
        mostrarPublicacoes();
    }

    // EVENTOS PARA ADDTEXTO.HTML
    const formPublicacao = document.getElementById('form-publicacao');
    if (formPublicacao) {
        console.log('📋 Inicializando formulário para addtexto.html...');
        
        // Configurar evento do formulário UMA VEZ
        formPublicacao.removeEventListener('submit', handleFormSubmit);
        formPublicacao.addEventListener('submit', handleFormSubmit);
        
        // Verificar modo edição
        verificarModoEdicao();
    }
}

// Handler específico para evitar duplicação
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Formulário submetido');
    salvarPublicacao();
}

// Iniciar a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}