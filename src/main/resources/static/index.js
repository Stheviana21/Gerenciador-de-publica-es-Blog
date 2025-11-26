// Pegamos os elementos do HTML usando seus IDs para poder usar no JavaScript
const btnIncluir = document.getElementById('btnIncluirblog');   // Botão que mostra o formulário
const formNovoTarefa = document.getElementById('formNovoblog'); // Formulário de criar novo blog
const blogcaixa = document.getElementById('blog-caixa');        // Div onde os blogs aparecem
const msgSucesso = document.getElementById('msgSucesso');       // Mensagem verde de sucesso
const msgErro = document.getElementById('msgErro');             // Mensagem vermelha de erro



//Explicação:
//JavaScript para pegar os elementos do HTML e criei uma comunicação com o back-end usando fetch. 
// Quando o usuário preenche o formulário, o JavaScript manda os dados para a API e depois busca tudo atualizado para mostrar na tela.
// Endereço do backend (API) onde os dados são buscados e enviados


const API_URL = 'http://localhost:8080/blog';

// Função que cria o HTML de cada blog que aparece na tela
function criarHTMLdoBlog(blog) {
    let aviso = '';

    // Se a data do blog for maior que a data de hoje, ele marca como "NÃO PUBLICADA"
    if (estaNoFuturo(blog.dataPublicacao)) {
        aviso = '<span class="late-label">NÃO PUBLICADA</span>';
    }

    // Retorna o HTML do blog — ou seja, como ele vai aparecer na página
    return `
        <div class="blog" id="blog-${blog.id}">
            <h3>${blog.titulo} ${aviso}</h3>
            <p>Autor: <strong>${blog.autor}</strong></p>
            <p>Data da publicação: <strong>${formatarData(blog.dataPublicacao)}</strong></p>
            <p class="description">${blog.texto}</p>

            <!-- Botões com funções para editar e excluir -->
            <button class="btn-edit" onclick="editBlog(${blog.id})">Editar</button>
            <button class="btn-delete" onclick="deleteBlog(${blog.id})">Excluir</button>
        </div>
    `;
}

// Função que busca todos os blogs do servidor (API) e mostra na tela
async function carregarBlogs() {
    try {
        const resposta = await fetch(API_URL); // Faz uma requisição GET na API

        // Se a resposta não for OK, dá erro
        if (!resposta.ok) throw new Error('Erro ao buscar os textos');

        const blogs = await resposta.json(); // Converte a resposta para JSON

        // Se não tiver blogs, mostra uma mensagem
        if (!blogs || blogs.length === 0) {
            blogcaixa.innerHTML = '<p>Nenhuma publicação encontrada.</p>';
            return;
        }

        // Limpa a tela e adiciona cada blog encontrado
        blogcaixa.innerHTML = '';
        blogs.forEach(blog => {
            blogcaixa.innerHTML += criarHTMLdoBlog(blog);
        });
    } catch (erro) {
        console.error(erro);
        blogcaixa.innerHTML = '<p>Erro ao carregar os textos.</p>';
    }
}

// Quando o usuário clicar para incluir um novo blog
btnIncluir.addEventListener('click', () => {
    formNovoTarefa.style.display = 'block'; // Mostra o formulário
    btnIncluir.style.display = 'none';     // Esconde o botão
    msgSucesso.textContent = '';           // Limpa mensagens anteriores
    msgErro.textContent = '';
});

// Quando o formulário for enviado (submit)
formNovoTarefa.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que a página recarregue

    // Pegando os valores digitados pelo usuário
    const novoBlog = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        dataPublicacao: document.getElementById('dataPublicacao').value,
        texto: document.getElementById('texto').value.trim(),
    };

    msgSucesso.textContent = '';
    msgErro.textContent = '';

    try {
        // Envia os dados para a API usando o método POST
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoBlog)
        });

        if (resposta.ok) {
            msgSucesso.textContent = 'Texto salvo com sucesso!'; // Mensagem positiva
            formNovoTarefa.reset();                              // Limpa os campos
            formNovoTarefa.style.display = 'none';               // Esconde o formulário
            btnIncluir.style.display = 'block';                  // Mostra o botão de incluir de novo
            carregarBlogs();                                     // Recarrega a lista de blogs
        } else {
            msgErro.textContent = 'Erro ao salvar o texto.';
        }
    } catch (erro) {
        msgErro.textContent = 'Erro de comunicação com o servidor.';
        console.error(erro);
    }
});

// Chama a função para carregar os blogs assim que a página abre
carregarBlogs();
