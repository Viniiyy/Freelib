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
// Apenas funcionários e administradores podem visualizar os empréstimos.
if (tipoContaT != 'funcionario' && tipoContaT != 'adm') {
    window.location.href = 'homeS.html';
}

// Recupera o elemento HTML onde os empréstimos serão exibidos.
const tabela = document.getElementById('pagebody');

// Busca todos os empréstimos cadastrados na API.
fetch('http://127.0.0.1:8000/Emprestimos/')
.then(response => {

    // Verifica se a resposta da API foi bem-sucedida.
    if (!response.ok) {
        throw new Error('Erro ao buscar empréstimos');
    }

    // Converte a resposta da API para JSON.
    return response.json();
})
.then(emprestimos => {

    // Limpa o conteúdo atual da tabela antes de inserir os empréstimos.
    tabela.innerHTML = '';

    // Verifica se existem empréstimos cadastrados.
    if (!emprestimos || emprestimos.length === 0) {

        // Exibe uma mensagem caso nenhum empréstimo seja encontrado.
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Nenhum empréstimo encontrado.
                </td>
            </tr>
        `;

        // Encerra a execução caso a lista esteja vazia.
        return;
    }

    // Percorre todos os empréstimos retornados pela API.
    emprestimos.forEach(emprestimo => {

        // Obtém o ID do livro.
        // Verifica se o campo contém um objeto ou diretamente o ID.
        const livroId = typeof emprestimo.livro === 'object'
            ? emprestimo.livro?.id
            : emprestimo.livro;

        // Obtém o ID do usuário associado ao empréstimo.
        // Verifica se o campo contém um objeto ou diretamente o ID.
        const usuarioId = typeof emprestimo.usuario === 'object'
            ? emprestimo.usuario?.id
            : emprestimo.usuario;

        // Busca simultaneamente as informações do livro e do usuário.
        // Promise.all aguarda a conclusão das duas requisições.
        Promise.all([

            // Busca os dados do livro utilizando seu ID.
            fetch(`http://127.0.0.1:8000/Livros/${livroId}/`)
                .then(response => {

                    // Verifica se a requisição do livro foi bem-sucedida.
                    if (!response.ok) throw new Error('Erro ao buscar livro');

                    // Converte os dados do livro para JSON.
                    return response.json();
                }),

            // Busca os dados do usuário utilizando seu ID.
            fetch(`http://127.0.0.1:8000/Usuarios/${usuarioId}/`)
                .then(response => {

                    // Verifica se a requisição do usuário foi bem-sucedida.
                    if (!response.ok) throw new Error('Erro ao buscar usuário');

                    // Converte os dados do usuário para JSON.
                    return response.json();
                })
        ])

        // Executa após a conclusão das duas requisições.
        // Os resultados são separados nas variáveis livro e usuario.
        .then(([livro, usuario]) => {

            // Cria uma nova linha para apresentar os dados do empréstimo.
            const linha = document.createElement('tr');

            // Insere as informações do empréstimo na linha da tabela.
            linha.innerHTML = `
                <td>${emprestimo.id}</td>
                <td>${livro.titulo}</td>
                <td>${usuario.nome}</td>
                <td>${emprestimo.data_emprestimo}</td>
                <td>${emprestimo.data_devolucao}</td>
            `;

            // Adiciona a linha preenchida à tabela.
            tabela.appendChild(linha);
        })

        .catch(error => {

            // Exibe no console qualquer erro ao buscar os dados relacionados ao empréstimo.
            console.error('Erro ao carregar empréstimo:', error);
        });
    });
})
.catch(error => {

    // Exibe no console qualquer erro ocorrido durante a busca dos empréstimos.
    console.error('Erro ao buscar empréstimos:', error);
});


// Redireciona o usuário para a página principal do sistema.
function homep() {
    window.location.href = 'homeS.html';
}

// Redireciona o usuário para a página de perfil, na seção de favoritos.
function favoritos() {
    window.location.href = 'perfil.html';
}

// Redireciona o usuário para a página de perfil, na seção de empréstimos.
function emprestimos() {
    window.location.href = 'perfil.html';
}