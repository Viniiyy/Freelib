const usuarioIdT = sessionStorage.getItem('usuarioId');
const tipoContaT = sessionStorage.getItem('tipoConta');

if (!usuarioIdT) {
    window.location.href = 'login.html';
}

if (tipoContaT != 'adm' && tipoContaT != 'funcionario') {
    window.location.href = 'homeS.html';
}

const tabela = document.getElementById('pagebody');

fetch('http://127.0.0.1:8000/Usuarios/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }

        return response.json();
    })
    .then(usuarios => {
        tabela.innerHTML = '';

        if (!usuarios || usuarios.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        Nenhum usuário encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        usuarios.forEach(usuario => {
            const linha = document.createElement('tr');
            if(tipoContaT != 'funcionario'){
                linha.innerHTML = `
                <td>
                    <img
                        src="${usuario.fotoPerfil}"
                        alt="Foto de ${usuario.nome}"
                        class="rounded-circle"
                        style="width: 50px; height: 50px; object-fit: cover;"
                    >
                </td>

                <td>${usuario.nome}</td>

                <td>${usuario.email}</td>

                <td>${usuario.tipo_conta}</td>

                <td>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="excluirPerfil(${usuario.id}, '${usuario.nome.replace(/'/g, "\\'")}')">
                        Excluir perfil
                    </button>
                </td>
            `;
            }else{
                linha.innerHTML = `
                <td>
                    <img
                        src="${usuario.fotoPerfil}"
                        alt="Foto de ${usuario.nome}"
                        class="rounded-circle"
                        style="width: 50px; height: 50px; object-fit: cover;"
                    >
                </td>

                <td>${usuario.nome}</td>

                <td>${usuario.email}</td>

                <td>${usuario.tipo_conta}</td>
            `;
            }
            

            tabela.appendChild(linha);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar usuários:', error);

        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Erro ao carregar os usuários.
                </td>
            </tr>
        `;
    });

function excluirPerfil(id, nome) {
    const confirmar = confirm(
        `Tem certeza que deseja excluir o perfil de ${nome}?`
    );

    if (!confirmar) {
        return;
    }

    fetch(`http://127.0.0.1:8000/Usuarios/${id}/`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir perfil');
        }

        alert('Perfil excluído com sucesso!');

        // Remove a linha da tabela sem precisar recarregar a página
        const botoes = document.querySelectorAll('#pagebody button');

        botoes.forEach(botao => {
            if (botao.getAttribute('onclick')?.includes(`(${id},`)) {
                botao.closest('tr').remove();
            }
        });
    })
    .catch(error => {
        console.error('Erro ao excluir perfil:', error);
        alert('Não foi possível excluir o perfil.');
    });
}