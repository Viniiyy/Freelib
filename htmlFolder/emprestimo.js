// Recupera os parâmetros presentes na URL.
const params = new URLSearchParams(window.location.search);

// Obtém o ID do livro informado no parâmetro "id" da URL.
const Id = params.get('id');

// Exibe o ID capturado no console para facilitar a depuração.
console.log("ID capturado da URL:", Id);

// Recupera o formulário de empréstimo.
const form = document.getElementById('formulario');

// Recupera o elemento responsável por exibir mensagens ao usuário.
const msg = document.getElementById('msg');

// Recupera o ID do usuário armazenado na sessão do navegador.
const usuarioIdT = sessionStorage.getItem('usuarioId');

// Recupera o tipo de conta do usuário armazenado na sessão.
const tipoContaT = sessionStorage.getItem('tipoConta');

// Verifica se existe um usuário identificado na sessão.
// Caso contrário, redireciona para a página de login.
if (!usuarioIdT) {
    window.location.href = 'login.html';
}


// Busca os dados do livro na API utilizando seu ID.
fetch(`http://127.0.0.1:8000/Livros/${Id}/`)
  .then(response => response.json())
  .then(livro => {

    // Recupera o elemento onde a imagem do livro será exibida.
    const l1 = document.getElementById('carInside');

    // Insere a imagem do livro no elemento HTML.
    l1.innerHTML = `
        <img src="${livro.imagem}" class="d-block align-items-center object-fit-cover" style="object-fit: contain; max-height: 300px;" alt="Imagem do livro"> 
    `;

    // Recupera o elemento onde o título do livro será exibido.
    const l2 = document.getElementById('nameBook');

    // Insere o título do livro na página.
    l2.innerHTML = `
      <h1 class="text-start text-light m-3">${livro.titulo}</h1>
    `;

    // Recupera o elemento onde a descrição do livro será exibida.
    const l3 = document.getElementById('descri');

    // Insere a descrição do livro na página.
    l3.innerHTML = `
        <p class="text-break " style="font-size: 3ch;">${livro.descricao}</p>
      `;
  })
  .catch(error => {

    // Exibe no console qualquer erro ocorrido durante a busca do livro.
    console.error('Erro ao buscar o livro:', error);
  });


// Adiciona um evento para capturar o envio do formulário de empréstimo.
form.addEventListener('submit', function(event) {

  // Impede que a página seja recarregada ao enviar o formulário.
  event.preventDefault();

  // Cria um objeto FormData para armazenar os dados do empréstimo.
  const formData = new FormData();

  // Adiciona o ID do livro que será emprestado.
  formData.append('livro', Id);

  // Adiciona o ID do usuário que está solicitando o empréstimo.
  formData.append('usuario', usuarioIdT);

  // Adiciona a data em que o empréstimo será realizado.
  formData.append('data_emprestimo', document.getElementById('dataEmprestimo').value);

  // Adiciona a data prevista para a devolução do livro.
  formData.append('data_devolucao', document.getElementById('dataDevolucao').value);

  // Envia os dados do empréstimo para a API através de uma requisição POST.
  fetch('http://127.0.0.1:8000/Emprestimos/', {
    method: 'POST',
    body: formData
  })

  .then(response => {

    // Verifica se a resposta da API indica uma operação bem-sucedida.
    if (!response.ok) throw new Error('Erro ' + response.status);

    // Converte a resposta da API para JSON.
    return response.json();
  })

  .then(data => {

    // Exibe os dados retornados pela API no console.
    console.log("Sucesso:", data);

    // Informa ao usuário que o empréstimo foi reservado.
    msg.textContent = "Empréstimo reservado com sucesso!";

    // Limpa os campos do formulário após a operação.
    form.reset();
  })

  .catch(error => {

    // Exibe os detalhes do erro no console.
    console.error('Erro ao enviar os dados:', error);

    // Informa ao usuário que ocorreu um erro durante a solicitação.
    msg.textContent = "Erro ao adicionar empréstimo";
  });
});


// Redireciona o usuário para a página de perfil, na seção de favoritos.
function favoritos(){
  window.location.href = "perfil.html";
}

// Redireciona o usuário para a página de perfil, na seção de empréstimos.
function emprestimos(){
  window.location.href = "perfil.html";
}

// Redireciona o usuário para a página principal do sistema.
function menuPrincipal(){
  window.location.href = "homeS.html";
}