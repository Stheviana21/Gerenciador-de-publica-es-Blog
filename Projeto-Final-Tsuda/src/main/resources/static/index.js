// Array para armazenar as publicações
let publicacoes = [
    {
        id: 1,
        titulo: "Como viver bem",
        autor: "Fulano da Silva",
        data: "31/10/2025",
        conteudo: "Veja neste texto dicas de como viver bem",
        publicado: true
    },
    {
        id: 2,
        titulo: "20 Dicas para falar bem",
        autor: "Ciclano de Souza",
        data: "02/12/2025",
        conteudo: "Aqui estão 20 dicas para você falar melhor em público",
        publicado: false
    }
];

// Função para carregar as publicações na página
function carregarPublicacoes() {
    const listaPublicacoes = document.getElementById('lista-publicacoes');
    listaPublicacoes.innerHTML = '';

    publicacoes.forEach((publicacao, index) => {
        const publicacaoElemento = criarElementoPublicacao(publicacao, index);
        listaPublicacoes.appendChild(publicacaoElemento);
        
        // Adicionar divisor entre publicações (exceto na última)
        if (index < publicacoes.length - 1) {
            const divisor = document.createElement('div');
            divisor.className = 'divisor';
            listaPublicacoes.appendChild(divisor);
        }
    });
}

// Função para criar o elemento HTML de uma publicação
function criarElementoPublicacao(publicacao, index) {
    const divPublicacao = document.createElement('div');
    divPublicacao.className = 'publicacao';
    divPublicacao.id = `publicacao-${publicacao.id}`;

    divPublicacao.innerHTML = `
        <h2 class="titulo-publicacao">${publicacao.titulo}</h2>
        <div class="info-publicacao">
            <span><strong>Autor:</strong> ${publicacao.autor}</span>
            <span><strong>Publicado em:</strong> ${publicacao.data}</span>
            ${!publicacao.publicado ? '<span class="status">NÃO PUBLICADO</span>' : ''}
        </div>
        <p class="conteudo-publicacao">${publicacao.conteudo}</p>
        <div class="acoes-publicacao">
            <button class="botao botao-alterar" onclick="alterarPublicacao(${index})">Alterar</button>
            <button class="botao botao-excluir" onclick="excluirPublicacao(${index})">Excluir</button>
        </div>
    `;

    return divPublicacao;
}

// Função para mostrar o formulário de nova publicação
function mostrarFormulario() {
    document.getElementById('formulario-publicacao').classList.remove('formulario-oculto');
    document.getElementById('form-nova-publicacao').reset();
    document.getElementById('titulo').focus();
}

// Função para ocultar o formulário
function ocultarFormulario() {
    document.getElementById('formulario-publicacao').classList.add('formulario-oculto');
}

// Função para adicionar nova publicação
function adicionarPublicacao(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data = document.getElementById('data').value;
    const conteudo = document.getElementById('conteudo').value;
    const publicado = document.getElementById('publicado').checked;
    
    // Formatar data para o padrão brasileiro
    const dataFormatada = formatarData(data);
    
    // Criar nova publicação
    const novaPublicacao = {
        id: publicacoes.length + 1,
        titulo: titulo,
        autor: autor,
        data: dataFormatada,
        conteudo: conteudo,
        publicado: publicado
    };
    
    // Adicionar ao array
    publicacoes.push(novaPublicacao);
    
    // Recarregar a lista
    carregarPublicacoes();
    
    // Ocultar formulário
    ocultarFormulario();
    
    // Mostrar mensagem de sucesso
    alert('Publicação adicionada com sucesso!');
}

// Função para alterar uma publicação
function alterarPublicacao(index) {
    const publicacao = publicacoes[index];
    
    // Preencher formulário com dados atuais
    document.getElementById('titulo').value = publicacao.titulo;
    document.getElementById('autor').value = publicacao.autor;
    
    // Converter data para o formato do input (YYYY-MM-DD)
    const dataParts = publicacao.data.split('/');
    const dataInput = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;
    document.getElementById('data').value = dataInput;
    
    document.getElementById('conteudo').value = publicacao.conteudo;
    document.getElementById('publicado').checked = publicacao.publicado;
    
    // Mostrar formulário
    mostrarFormulario();
    
    // Alterar o comportamento do formulário para edição
    const formulario = document.getElementById('form-nova-publicacao');
    formulario.onsubmit = function(event) {
        event.preventDefault();
        salvarAlteracao(index);
    };
    
    // Alterar texto do botão
    document.querySelector('.botao-salvar').textContent = 'Salvar Alterações';
}

// Função para salvar alterações
function salvarAlteracao(index) {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data = document.getElementById('data').value;
    const conteudo = document.getElementById('conteudo').value;
    const publicado = document.getElementById('publicado').checked;
    
    // Formatar data
    const dataFormatada = formatarData(data);
    
    // Atualizar publicação
    publicacoes[index] = {
        ...publicacoes[index],
        titulo: titulo,
        autor: autor,
        data: dataFormatada,
        conteudo: conteudo,
        publicado: publicado
    };
    
    // Recarregar lista
    carregarPublicacoes();
    
    // Ocultar formulário
    ocultarFormulario();
    
    // Restaurar comportamento padrão do formulário
    document.getElementById('form-nova-publicacao').onsubmit = adicionarPublicacao;
    document.querySelector('.botao-salvar').textContent = 'Salvar';
    
    alert('Publicação alterada com sucesso!');
}

// Função para excluir uma publicação
function excluirPublicacao(index) {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
        publicacoes.splice(index, 1);
        carregarPublicacoes();
        alert('Publicação excluída com sucesso!');
    }
}

// Função para formatar data (de YYYY-MM-DD para DD/MM/YYYY)
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Configurações iniciais quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Carregar publicações iniciais
    carregarPublicacoes();
    
    // Configurar formulário
    document.getElementById('form-nova-publicacao').onsubmit = adicionarPublicacao;
    
    // Configurar data atual como padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
});