const API_URL = 'http://localhost:8080/api/publicacoes';

// Variável para controlar se já está salvando
let salvando = false;

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

// Função para salvar nova publicação - COM PROTEÇÃO
async function salvarPublicacao() {
    console.log('salvarPublicacao executando...');
    
    // PREVENIR DUPLO CLIQUE
    if (salvando) {
        console.log('⚠️ Já está salvando, ignorando chamada duplicada');
        return;
    }
    
    salvando = true;
    console.log('✅ Iniciando salvamento...');
    
    try {
        // Pegar valores dos campos
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const data = document.getElementById('data').value;
        const conteudo = document.getElementById('conteudo').value;
        
        console.log('Dados a serem salvos:', { titulo, autor, data, conteudo });
        
        // Validar campos obrigatórios
        if (!titulo || !autor || !data || !conteudo) {
            alert('Preencha todos os campos!');
            salvando = false;
            return;
        }
        
        // Criar objeto da publicação
        const novaPublicacao = {
            titulo: titulo,
            autor: autor,
            dataPublicacao: data,
            conteudo: conteudo,
            publicado: true
        };
        
        console.log('📤 Enviando para API...');
        
        // Enviar para API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaPublicacao)
        });
        
        console.log('📥 Resposta recebida:', response.status);
        
        if (response.ok) {
            const publicacaoSalva = await response.json();
            console.log('✅ Publicação salva com ID:', publicacaoSalva.id);
            alert('Publicação salva com sucesso!');
            
            // Limpar formulário
            document.getElementById('form-publicacao').reset();
            
            // Voltar para página principal
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            throw new Error('Erro na resposta do servidor: ' + response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        alert('Erro ao salvar: ' + error.message);
    } finally {
        // Sempre liberar o bloqueio
        salvando = false;
        console.log('🔓 Salvamento liberado');
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

// Função para verificar se a publicação é futura
function isPublicacaoFutura(dataPublicacao) {
    const dataPub = new Date(dataPublicacao);
    const hoje = new Date();
    
    // Resetar horas para comparar apenas as datas
    hoje.setHours(0, 0, 0, 0);
    dataPub.setHours(0, 0, 0, 0);
    
    return dataPub > hoje;
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
        
        // VERIFICAR SE É PUBLICAÇÃO FUTURA (data > hoje)
        const isNaoPublicado = isPublicacaoFutura(publicacao.dataPublicacao);
        
        // Adicionar classe CSS se for futura
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

// Função para editar
function editarPublicacao(id) {
    alert('Editando publicação: ' + id);
    // window.location.href = '/editar-publicacao?id=' + id;
}

// Função para voltar para lista
function voltarParaLista() {
    window.location.href = 'index.html';
}

// INICIALIZAÇÃO - Executa apenas uma vez
function inicializarApp() {
    console.log('🚀 Inicializando aplicação...');
    
    // Event delegation para os botões - JÁ EXISTENTE
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('botao-excluir')) {
            const id = event.target.getAttribute('data-id');
            excluirPublicacao(id);
        }
        
        if (event.target.classList.contains('botao-alterar')) {
            const id = event.target.getAttribute('data-id');
            editarPublicacao(id);
        }
    });

    // Event listener para o formulário - ALTERNATIVA MAIS SEGURA
    const form = document.getElementById('form-publicacao');
    if (form) {
        // Remover event listeners anteriores para evitar duplicação
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    }

    // Carregar publicações se estiver na página certa
    if (document.getElementById('lista-publicacoes')) {
        console.log('📝 Carregando publicações...');
        mostrarPublicacoes();
    }
}

// Handler específico para o formulário
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('📋 Formulário submetido (handler específico)');
    salvarPublicacao();
}

// Iniciar a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}