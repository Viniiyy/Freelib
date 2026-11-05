// Recupera o ID do usuário armazenado na sessão.
const id = sessionStorage.getItem('usuarioId');

// Verifica se existe um usuário autenticado na sessão.
if(!id) {
    // Redireciona para a página de login caso não exista uma sessão.
    window.location.href = 'login.html'
}


// Busca os dados do usuário na API utilizando seu identificador.
fetch(`http://127.0.0.1:8000/Usuarios/${id}/`)
  .then(response => response.json())
  .then(user => {

    // Recupera os elementos HTML onde as informações do usuário serão exibidas.
    const nome = document.getElementById('nomeUser');
    const email = document.getElementById('MailUser');
    const tipoC = document.getElementById('TipoUser');
    const foto = document.getElementById('ImgUser');

    // Cria um campo de edição preenchido com o nome atual do usuário.
    nome.innerHTML = `
        <input type="text" class="form-control" id="nome" placeholder="Nome" value="${user.nome}">
    `;

    // Cria um campo de edição preenchido com o e-mail atual do usuário.
    email.innerHTML = `
        <input type="text" class="form-control" id="email" placeholder="Email" value="${user.email}">
    `;

    // Exibe o tipo de conta do usuário sem permitir sua edição pela interface.
    tipoC.innerHTML = `
        <label>Tipo de conta:</label>
        <span>${user.tipo_conta}</span>
    `;

    // Exibe a foto de perfil atual e disponibiliza um campo para selecionar outra imagem.
    foto.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${user.fotoPerfil}" class="rounded-circle" style="width: 100px; height: 100px;">
            <input type="file" class="form-control" id="fotoPerfil" placeholder="Foto de Perfil" style="max-width: 300px;">
        </div>
    `;
  })

// Adiciona um evento para capturar o envio do formulário de edição.
formulario.addEventListener('submit',function(event){

    // Impede o comportamento padrão de envio do formulário.
    event.preventDefault();

    // Cria um objeto FormData com os dados preenchidos no formulário.
    const formData = new FormData(formulario);

    // Adiciona os dados que serão enviados à API.
    formData.append('')
})