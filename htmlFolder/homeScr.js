// Recupera os filtros armazenados no localStorage.
// Caso não exista nenhum filtro salvo, inicializa um array vazio.
let filter = JSON.parse(localStorage.getItem('filter')) || [];

// Recupera a lista de livros armazenada no localStorage.
// Caso não exista uma lista salva, inicializa um array vazio.
let lista = JSON.parse(localStorage.getItem('lista')) || [];

// Obtém o parâmetro "busca" da URL e converte o texto para letras minúsculas.
// Caso não exista um termo de pesquisa, utiliza uma string vazia.
const busca = (new URLSearchParams(window.location.search).get('busca') || '').toLowerCase();


// Busca as categorias cadastradas na API.
fetch('http://127.0.0.1:8000/Categorias/')
    .then(response => response.json())
    .then(categoria => {

        // Recupera o elemento HTML onde os filtros de categoria serão adicionados.
        const fil = document.getElementById('filter');

        // Percorre todas as categorias recebidas pela API.
        categoria.forEach(categoria => {

            // Cria um elemento div para armazenar cada categoria.
            const cat = document.createElement('div');

            // Define a classe CSS do elemento.
            cat.className = 'cat';

            // Insere um botão contendo o nome da categoria.
            cat.innerHTML = `
                <button class="btn" style="background-color: #223146; color: white" type="button">
                    ${categoria.categoria}
                </button>
            `;

            // Adiciona o elemento criado à área de filtros.
            fil.appendChild(cat);
        });
    })
    .catch(error => {

        // Exibe no console qualquer erro ocorrido durante a busca das categorias.
        console.error('Erro ao buscar da API:', error);
    });


// Busca todos os livros cadastrados na API.
fetch('http://127.0.0.1:8000/Livros/')
    .then(response => response.json())
    .then(livros => {

        // Recupera o elemento HTML onde os cards dos livros serão exibidos.
        const cardlivros = document.getElementById('pagebody');

        // Percorre todos os livros recebidos pela API.
        livros.forEach(livro => {

            // Verifica se o título do livro contém o termo pesquisado.
            // Caso não contenha, ignora o livro e passa para o próximo.
            if (!livro.titulo.toLowerCase().includes(busca)) return;

            // Cria um elemento div para armazenar o card do livro.
            const card = document.createElement('div');

            // Define a classe CSS utilizada para organizar os cards.
            card.className = 'col-auto';

            // Insere as informações do livro no card.
            card.innerHTML = `
                <div onclick="paginaL(${livro.id})" class="card rounded-5 text-center h-100 d-flex flex-column" style="width: 13rem">
                    <img src="${livro.imagem}" class="card-img-top rounded-top-5" alt="Imagem do livro">
                    <div class="card-body rounded-bottom-5" style="background-color: #223146;">    
                        <p class="card-text backgo text-white">
                            ${livro.titulo}
                        </p>
                    </div>
                </div>
            `;

            // Adiciona o card criado à área de listagem de livros.
            cardlivros.appendChild(card);
        });
    })
    .catch(error => {

        // Exibe no console qualquer erro ocorrido durante a busca dos livros.
        console.error('Erro ao buscar livros:', error);
    });


// Redireciona para a página de empréstimo do livro selecionado.
// O ID do livro é enviado como parâmetro na URL.
function paginaL(id){
    window.location.href = `emprestimo.html?id=${id}`;
}