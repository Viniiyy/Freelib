// Busca todos os livros cadastrados na API.
fetch('http://127.0.0.1:8000/Livros/')
    .then(response => response.json())
    .then(livros => {

        // Recupera o elemento HTML onde a lista de livros será exibida.
        const list = document.getElementById('listLivros');

        // Percorre todos os livros recebidos pela API.
        livros.forEach(livro => {

            // Cria um elemento de lista para representar cada livro.
            const li = document.createElement('li');

            // Define as classes do Bootstrap para organizar o conteúdo.
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            // Insere as informações do livro e os botões de gerenciamento.
            li.innerHTML = `
                <div>
                    <!-- Exibe a imagem do livro. -->
                    <img src="${livro.imagem}" style="width: 100px; height: 150px;">

                    <!-- Exibe o título do livro. -->
                    <h5>${livro.titulo}</h5>

                    <!-- Exibe a descrição do livro. -->
                    <p>${livro.descricao}</p>

                    <!-- Exibe a situação, a data de entrada e a categoria do livro. -->
                    <small>${livro.situacao} - ${livro.dataEntrada} - ${livro.categoria.categoria}</small>
                </div>

                <div>
                    <!-- Redireciona para a página de edição, enviando o ID do livro pela URL. -->
                    <a href="editar.html?id=${livro.id}" class="btn btn-sm btn-primary">
                        editar
                    </a>

                    <!-- Executa a função de exclusão utilizando o ID do livro. -->
                    <button id="lista" class="btn btn-sm btn-danger" onclick="excluirLivro(${livro.id})">
                        excluir
                    </button>
                </div>
            `;

            // Adiciona o item criado à lista de livros.
            list.appendChild(li);
        });
    })
    .catch(error => {

        // Exibe no console qualquer erro ocorrido durante a busca dos livros.
        console.error('Erro ao buscar da API:', error);

        // Exibe uma mensagem de erro na página.
        document.getElementById('listLivros').innerHTML = '<p>Erro ao buscar da API</p>';
    });


// Função responsável por excluir um livro utilizando seu ID.
function excluirLivro(id){

    // Envia uma requisição DELETE para a API, identificando o livro pelo ID.
    fetch(`http://127.0.0.1:8000/Livros/${id}/`, {
        method: 'DELETE',
    })

    .then(response => {

        // Verifica se a API confirmou a exclusão do livro.
        if (response.ok) {

            // Redireciona para a listagem após a exclusão bem-sucedida.
            window.location.href = 'listBook.html';

        } else {

            // Exibe uma mensagem caso o servidor não consiga excluir o livro.
            alert('Erro ao excluir o livro.');
        }
    })

    .catch(error => {

        // Exibe os detalhes do erro no console.
        console.error('Erro ao excluir o livro:', error);

        // Informa ao usuário que ocorreu um erro durante a exclusão.
        alert('Erro ao excluir o livro.');
    });
}