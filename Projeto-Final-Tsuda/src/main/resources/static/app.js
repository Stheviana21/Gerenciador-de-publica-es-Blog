// app.js - ARQUIVO ÚNICO PARA AMBAS AS PÁGINAS
const API_URL = 'http://localhost:8080/api/publicacoes';
let salvando = false;
let postAtualId = null;
let eventoRegistrado = false;

async function excluirPublicacao(id, titulo) {
    // Mostrar modal personalizado
    const modal = `
        <div class="modal-overlay" id="modal-exclusao">
            <div class="modal">
                <h3>Confirmar exclusão</h3>
                <p>Deseja excluir "${titulo || 'esta publicação'}"?</p>
                <div class="modal-botoes">
                    <button id="btn-confirmar" class="modal-btn btn-confirmar">SIM</button>
                    <button id="btn-cancelar" class="modal-btn btn-cancelar">NÃO</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modal);

    // Retornar uma Promise
    return new Promise((resolve) => {
        // Botão NÃO
        document.getElementById('btn-cancelar').addEventListener('click', () => {
            fecharModal();
            resolve(false);
        });

        // Botão SIM
        document.getElementById('btn-confirmar').addEventListener('click', async () => {
            fecharModal();

            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Excluído com sucesso!');
                    mostrarPublicacoes();
                    resolve(true);
                } else {
                    throw new Error('Erro ao excluir: ' + response.status);
                }
            } catch (error) {
                alert('Erro ao excluir: ' + error.message);
                resolve(false);
            }
        });

        // Fechar modal ao clicar fora
        document.getElementById('modal-exclusao').addEventListener('click', (e) => {
            if (e.target.id === 'modal-exclusao') {
                fecharModal();
                resolve(false);
            }
        });
    });

    function fecharModal() {
        const modal = document.getElementById('modal-exclusao');
        if (modal) modal.remove();
    }
}

// Modifique seu adicionarEventListeners() para:
function adicionarEventListeners() {
    document.querySelectorAll('.botao-excluir').forEach(botao => {
        botao.addEventListener('click', async function () {
            const id = this.getAttribute('data-id');
            const titulo = this.getAttribute('data-titulo') || 'Publicação';

            // Usa o modal personalizado
            const confirmado = await excluirPublicacao(id, titulo);
            console.log('Exclusão confirmada?', confirmado);
        });
    });

    // ... restante do código dos botões de alterar
}


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
            <p>${publicacao.conteudo}</p>
            <div class="botoes">
                <button class="botao-alterar" data-id="${publicacao.id}">Alterar</button>
                <button class="botao-excluir" data-id="${publicacao.id}">Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });

    adicionarEventListeners();
}

// Função para adicionar event aos botões
function adicionarEventListeners() {
    document.querySelectorAll('.botao-excluir').forEach(botao => {
        botao.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            excluirPublicacao(id);
        });
    });

    document.querySelectorAll('.botao-alterar').forEach(botao => {
        botao.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            window.location.href = `addtexto.html?id=${id}`;
        });
    });
}

// Função para excluir publicação
// async function excluirPublicacao(id) {
//     if (confirm('Tem certeza que quer excluir?')) {
//         try {
//             const response = await fetch(`${API_URL}/${id}`, {
//                 method: 'DELETE'
//             });

//             if (response.ok) {
//                 alert('Excluído com sucesso!');
//                 mostrarPublicacoes();
//             } else {
//                 throw new Error('Erro ao excluir: ' + response.status);
//             }
//         } catch (error) {
//             alert('Erro ao excluir: ' + error.message);
//         }
//     }
// }

// Função para voltar para lista
function voltarParaLista() {
    window.location.href = 'index.html';
}

// Função para carregar dados da publicação
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

        document.getElementById('conteudo').value = publicacao.conteudo;

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


async function salvarPublicacao() {
    if (salvando) return;
    salvando = true;

    try {
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const data = document.getElementById('data').value;
        const conteudo = document.getElementById('conteudo').value;

        console.log('Dados do formulário:', { titulo, autor, data, conteudo });

        // Validações frontend 
        if (!titulo || !autor || !data || !conteudo) {
            alert('Preencha todos os campos!');
            salvando = false;
            return;
        }

        if (titulo.length < 5) {
            alert('Título deve ter no mínimo 5 caracteres!');
            salvando = false;
            return;
        }

        if (autor.length < 3) {
            alert('Autor deve ter no mínimo 3 caracteres!');
            salvando = false;
            return;
        }

        if (conteudo.length < 10) {
            alert('O texto deve ter no mínimo 10 caracteres!');
            salvando = false;
            return;
        }

        // Formatar data
        const dataComHorario = data + 'T12:00:00';

        const publicacao = {
            titulo: titulo,
            autor: autor,
            dataPublicacao: dataComHorario,
            conteudo: conteudo
        };

        // Verificar se é edição
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        let url = API_URL;
        let method = 'POST';

        if (id) {
            url = `${API_URL}/${id}`;
            method = 'PUT';

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

        console.log('Status da resposta:', response.status);

        if (response.ok) {
            const publicacaoSalva = await response.json();
            const mensagem = id ? 'Publicação atualizada com sucesso!' : 'Publicação salva com sucesso!';
            alert(mensagem);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);

        } else {

            const errorData = await response.json();
            console.error('Erro completo do backend:', errorData);


            let errorMessage = 'Erro ao salvar: ';

            if (errorData.message) {

                errorMessage += errorData.message;
            } else if (errorData.error) {
                errorMessage += errorData.error;
            } else {
                errorMessage += 'Dados inválidos. Verifique os campos.';
            }

            alert(errorMessage);
        }

    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro: ' + error.message);
        salvando = false;
    }
}


function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Formulário submetido - salvando publicação');
    salvarPublicacao();
}

// ========== INICIALIZAÇÃO PARA AMBAS PÁGINAS ==========

function inicializarApp() {
    if (document.getElementById('lista-publicacoes')) {
        mostrarPublicacoes();
    }


    const formPublicacao = document.getElementById('form-publicacao');
    if (formPublicacao) {
        console.log('📋 Inicializando formulário para addtexto.html...');

        if (!eventoRegistrado) {
            formPublicacao.addEventListener('submit', handleFormSubmit);
            eventoRegistrado = true;
            console.log('✅ Evento de submit registrado UMA VEZ');
        }

        // Verificar modo edição
        verificarModoEdicao();
    }
}

// Iniciar a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}