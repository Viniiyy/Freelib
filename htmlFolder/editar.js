// Recupera o formulário de edição de livros.
const formulario = document.getElementById('formLivro');

// Recupera o elemento responsável por exibir mensagens ao usuário.
const msg = document.getElementById('msg');

// Recupera o campo de seleção de categorias.
const select = document.getElementById('selct-categoria');

// Obtém o ID do livro através do parâmetro "id" presente na URL.
const id = new URLSearchParams(window.location.search).get('id');


// Busca as categorias cadastradas na API.
fetch('http://127.0.0.1:8000/Categorias/')
    .then(response => response.json())
    .then(categoria => {

        // Ordena as categorias em ordem alfabética.
        categoria.sort((a, b) => a.categoria.localeCompare(b.categoria));

        // Define a opção inicial do campo de seleção.
        select.innerHTML = '<option select disable> Selecione uma categoria </option>';

        // Percorre as categorias recebidas pela API.
        categoria.forEach(categoria => {

            // Cria uma nova opção para o campo de seleção.
            const option = document.createElement('option');

            // Define o ID da categoria como valor da opção.
            option.value = categoria.id;

            // Define o nome da categoria como texto exibido.
            option.textContent = categoria.categoria;

            // Adiciona a opção ao campo de seleção.
            select.appendChild(option);
        });
    })
    .catch(error => {

        // Exibe uma mensagem caso não seja possível carregar as categorias.
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    });


// Adiciona um evento para capturar o envio do formulário.
formulario.addEventListener('submit', function(event){

    // Impede que a página seja recarregada ao enviar o formulário.
    event.preventDefault();

    // Cria um objeto FormData para armazenar os dados do livro.
    const formData = new FormData();

    // Adiciona o título do livro.
    formData.append('titulo', document.getElementById('nlivro').value);

    // Adiciona a descrição do livro.
    formData.append('descricao', document.getElementById('descricao').value);

    // Adiciona a data de entrada do livro.
    formData.append('dataEntrada', document.getElementById('data').value);

    // Adiciona o arquivo de imagem selecionado pelo usuário.
    formData.append('imagem', document.getElementById('imagem').files[0]);

    // Adiciona o ID da categoria selecionada.
    formData.append('categoria', document.getElementById('selct-categoria').value);

    // Adiciona a situação atual do livro.
    formData.append('situacao', document.getElementById('situacao').value);

    // Envia os dados para a API, utilizando o ID do livro para identificar o registro.
    fetch(`http://127.0.0.1:8000/Livros/${id}/`, {
        method: 'PUT',
        body: formData
    })

    // Converte a resposta da API para JSON.
    .then(response => response.json())

    .then(data => {

        // Exibe uma mensagem informando que a operação foi concluída.
        alert("Livro adicionado com sucesso!");

        // Exibe os dados retornados pela API no console.
        console.log("Sucesso:", data);

        // Exibe uma mensagem de sucesso na página.
        msg.textContent = "Livro adicionado com sucesso!";

        // Limpa os campos do formulário.
        formulario.reset();
    })

    .catch(error => {

        // Exibe os detalhes do erro no console.
        console.error('Erro ao enviar os dados:', error);

        // Informa ao usuário que ocorreu um erro durante a operação.
        msg.textContent = "Erro ao adicionar livro";
    });
});


// Redireciona o usuário para a página de listagem de livros.
function listPage(){
    window.location.href = "ListBook.html";
}