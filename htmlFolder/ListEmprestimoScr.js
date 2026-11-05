const usuarioIdT = sessionStorage.getItem('usuarioId');
const tipoContaT = sessionStorage.getItem('tipoConta');

if (!usuarioIdT) {
    window.location.href = 'login.html';
}

if (tipoContaT != 'funcionario' && tipoContaT != 'adm') {
    window.location.href = 'homeS.html';
}

const tabela = document.getElementById('pagebody');

fetch('http://127.0.0.1:8000/Emprestimos/')
.then(response => {
if (!response.ok) {
throw new Error('Erro ao buscar empréstimos');
}
return response.json();
})
.then(emprestimos => {
tabela.innerHTML = '';

    if (!emprestimos || emprestimos.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Nenhum empréstimo encontrado.
                </td>
            </tr>
        `;
        return;
    }

    emprestimos.forEach(emprestimo => {
        const livroId = typeof emprestimo.livro === 'object'
            ? emprestimo.livro?.id
            : emprestimo.livro;

        const usuarioId = typeof emprestimo.usuario === 'object'
            ? emprestimo.usuario?.id
            : emprestimo.usuario;

        // Busca as informações do livro e do usuário
        Promise.all([
            fetch(`http://127.0.0.1:8000/Livros/${livroId}/`)
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao buscar livro');
                    return response.json();
                }),
            fetch(`http://127.0.0.1:8000/Usuarios/${usuarioId}/`)
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao buscar usuário');
                    return response.json();
                })
        ])
        .then(([livro, usuario]) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${emprestimo.id}</td>
                <td>${livro.titulo}</td>
                <td>${usuario.nome}</td>
                <td>${emprestimo.data_emprestimo}</td>
                <td>${emprestimo.data_devolucao}</td>
            `;

            tabela.appendChild(linha);
        })
        .catch(error => {
            console.error('Erro ao carregar empréstimo:', error);
        });
    });
})
.catch(error => {
    console.error('Erro ao buscar empréstimos:', error);
});

function homep() {
window.location.href = 'homeS.html';
}

function favoritos() {
window.location.href = 'perfil.html';
}

function emprestimos() {
window.location.href = 'perfil.html';
}