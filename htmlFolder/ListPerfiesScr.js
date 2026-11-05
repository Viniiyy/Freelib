// Recupera o ID do usuário armazenado na sessão do navegador.
const usuarioIdT = sessionStorage.getItem('usuarioId');

// Recupera o tipo de conta do usuário armazenado na sessão.
const tipoContaT = sessionStorage.getItem('tipoConta');

// Verifica se existe um usuário identificado na sessão.
// Caso contrário, redireciona para a página de login.
if (!usuarioIdT) {
    window.location.href = 'login.html';
}

// Verifica se o usuário possui permissão para acessar a página.
// Apenas administradores e funcionários podem visualizar a listagem.
if (tipoContaT != 'adm' && tipoContaT != 'funcionario') {
    window.location.href = 'homeS.html';
}

// Recupera o elemento HTML onde os usuários serão exibidos.
const tabela = document.getElementById('pagebody');

// Busca todos os usuários cadastrados na API.
fetch('http://127.0.0.1:8000/Usuarios/')
    .then(response => {

        // Verifica se a resposta da API foi bem-sucedida.
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        // Converte a resposta da API para JSON.
        return response.json();
    })
    .then(usuarios => {

        // Limpa o conteúdo atual da tabela antes de inserir os usuários.
        tabela.innerHTML = '';

        // Verifica se existem usuários cadastrados.
        if (!usuarios || usuarios.length === 0) {

            // Exibe uma mensagem caso nenhum usuário seja encontrado.
            tabela.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        Nenhum usuário encontrado.
                    </td>
                </tr>
            `;

            // Encerra a execução caso a lista esteja vazia.
            return;
        }

        // Percorre todos os usuários retornados pela API.
        usuarios.forEach(usuario => {

            // Cria uma nova linha para apresentar os dados do usuário.
            const linha = document.createElement('tr');

            // Verifica se o usuário logado não é um funcionário.
            // Nesse caso, exibe também o botão de exclusão do perfil.
            if(tipoContaT != 'funcionario'){

                // Insere os dados do usuário e o botão de exclusão na linha.
                linha.innerHTML = `
                <td>
                    <!-- Exibe a foto de perfil do usuário. -->
                    <img
                        src="${usuario.fotoPerfil}"
                        alt="Foto de ${usuario.nome}"
                        class="rounded-circle"
                        style="width: 50px; height: 50px; object-fit: cover;"
                    >
                </td>

                <!-- Exibe o nome do usuário. -->
                <td>${usuario.nome}</td>

                <!-- Exibe o email do usuário. -->
                <td>${usuario.email}</td>

                <!-- Exibe o tipo de conta do usuário. -->
                <td>${usuario.tipo_conta}</td>

                <td>
                    <!-- Executa a função de exclusão utilizando o ID e o nome do usuário. -->
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="excluirPerfil(${usuario.id}, '${usuario.nome.replace(/'/g, "\\'")}')">
                        Excluir perfil
                    </button>
                </td>
            `;

            } else {

                // Para funcionários, exibe os dados sem disponibilizar a exclusão.
                linha.innerHTML = `
                <td>
                    <!-- Exibe a foto de perfil do usuário. -->
                    <img
                        src="${usuario.fotoPerfil}"
                        alt="Foto de ${usuario.nome}"
                        class="rounded-circle"
                        style="width: 50px; height: 50px; object-fit: cover;"
                    >
                </td>

                <!-- Exibe o nome do usuário. -->
                <td>${usuario.nome}</td>

                <!-- Exibe o email do usuário. -->
                <td>${usuario.email}</td>

                <!-- Exibe o tipo de conta do usuário. -->
                <td>${usuario.tipo_conta}</td>
            `;
            }

            // Adiciona a linha preenchida à tabela.
            tabela.appendChild(linha);
        });
    })
    .catch(error => {

        // Exibe no console qualquer erro ocorrido durante a busca dos usuários.
        console.error('Erro ao buscar usuários:', error);

        // Exibe uma mensagem de erro na tabela.
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Erro ao carregar os usuários.
                </td>
            </tr>
        `;
    });


// Função responsável por excluir o perfil de um usuário.
function excluirPerfil(id, nome) {

    // Solicita confirmação antes de realizar a exclusão.
    const confirmar = confirm(
        `Tem certeza que deseja excluir o perfil de ${nome}?`
    );

    // Encerra a função caso o usuário cancele a operação.
    if (!confirmar) {
        return;
    }

    // Envia uma requisição DELETE para a API utilizando o ID do usuário.
    fetch(`http://127.0.0.1:8000/Usuarios/${id}/`, {
        method: 'DELETE'
    })
    .then(response => {

        // Verifica se a exclusão foi realizada com sucesso.
        if (!response.ok) {
            throw new Error('Erro ao excluir perfil');
        }

        // Exibe uma mensagem confirmando a exclusão.
        alert('Perfil excluído com sucesso!');

        // Remove a linha correspondente ao usuário excluído
        // sem precisar recarregar a página.
        const botoes = document.querySelectorAll('#pagebody button');

        // Percorre os botões de exclusão presentes na tabela.
        botoes.forEach(botao => {

            // Verifica se o atributo onclick contém o ID do usuário excluído.
            if (botao.getAttribute('onclick')?.includes(`(${id},`)) {

                // Localiza a linha da tabela associada ao botão e a remove.
                botao.closest('tr').remove();
            }
        });
    })
    .catch(error => {

        // Exibe no console os detalhes do erro ocorrido durante a exclusão.
        console.error('Erro ao excluir perfil:', error);

        // Informa ao usuário que não foi possível excluir o perfil.
        alert('Não foi possível excluir o perfil.');
    });
}