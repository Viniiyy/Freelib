// Recupera o ID do usuário armazenado na sessão do navegador.
const usuarioIdT = sessionStorage.getItem('usuarioId');

// Verifica se existe um usuário identificado na sessão.
// Caso contrário, redireciona para a página de login.
if (!usuarioIdT) {
    window.location.href = 'login.html';
}


// Busca as informações do usuário na API utilizando seu ID.
fetch(`http://127.0.0.1:8000/Usuarios/${usuarioIdT}/`)
    .then(response => response.json())
    .then(user => {

        // Recupera o elemento HTML onde as informações do usuário serão exibidas.
        const userInfo = document.getElementById('userInfo');

        // Armazena o nome do usuário retornado pela API.
        const userName = user.nome;

        // Armazena o endereço da foto de perfil do usuário.
        const userFt = user.fotoPerfil;

        // Cria um elemento div para organizar as informações do perfil.
        const userInf = document.createElement('div');

        // Insere o nome e a foto de perfil no elemento criado.
        userInf.innerHTML = `
            <span>${userName}</span>    
            <img src="${userFt}" alt="Perfil" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;">
        `;

        // Adiciona as informações do usuário à página.
        userInfo.appendChild(userInf);
    });


// Busca os empréstimos associados ao usuário através de um endpoint personalizado da API.
fetch(`http://127.0.0.1:8000/Usuarios/${usuarioIdT}/emprestimos/`)
    .then(response => response.json())
    .then(emprestimos => {

        // Recupera o elemento HTML onde os empréstimos serão exibidos.
        const userEmprest = document.getElementById('pagebody');

        // Verifica se o usuário possui empréstimos cadastrados.
        if (!emprestimos || emprestimos.length === 0) {

            // Exibe uma mensagem caso não existam empréstimos.
            alert("Você não tem livros emprestados");

            // Encerra a execução caso a lista esteja vazia.
            return;
        }

        // Percorre todos os empréstimos retornados pela API.
        emprestimos.forEach(emprestimo => {

            // Recupera o ID do livro associado ao empréstimo.
            const livroId = emprestimo.livro;

            // Recupera a data prevista para a devolução do livro.
            const dtDevolucao = emprestimo.data_devolucao;

            // Verifica se a data de devolução já passou.
            const atraso = new Date(dtDevolucao) < new Date();

            // Define a cor de fundo conforme a situação do empréstimo.
            // Vermelho para empréstimos atrasados e cinza para os demais.
            const Cfundo = atraso ? '#D08787' : '#D9D9D9';

            // Define o texto que será exibido conforme a situação do empréstimo.
            const textt = atraso ? 'Atrasado' : 'Devolução';

            // Busca as informações do livro associado ao empréstimo.
            fetch(`http://127.0.0.1:8000/Livros/${livroId}/`)
                .then(response => response.json())
                .then(livro => {

                    // Cria um elemento div para armazenar o card do livro.
                    const card = document.createElement('div');

                    // Define as classes CSS utilizadas para organizar o card.
                    card.className = 'col-auto';

                    // Insere a imagem do livro e as informações da devolução no card.
                    card.innerHTML = `
                        <div class="card rounded-5 text-center h-100 d-flex flex-column" style="width: 13rem;">
                            <!-- Exibe a imagem do livro. -->
                            <img src="${livro.imagem}" class="card-img-top rounded-top-5" alt="Imagem do livro">

                            <div class="card-body rounded-bottom-5" style="background-color: #284d81;">
                                <!-- Define a aparência do indicador conforme a situação do empréstimo. -->
                                <div class="h-100 w-100 rounded-5" style="background-color: ${Cfundo};">
                                    <p class="card-text text-black">
                                        ${textt} - ${dtDevolucao}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;

                    // Adiciona o card à área de empréstimos do usuário.
                    userEmprest.appendChild(card);
                })
                .catch(error => {

                    // Exibe no console qualquer erro ocorrido durante a busca do livro.
                    console.error('Erro ao buscar livros:', error);
                });
        });
    })
    .catch(error => {

        // Exibe no console qualquer erro ocorrido durante a busca dos empréstimos.
        console.error('Erro ao buscar da API:', error);
    });


// Redireciona o usuário para a página principal do sistema.
function homep(){
    window.location.href = 'homeS.html';
}

// Redireciona o usuário para a página de perfil, na seção de favoritos.
function favoritos(){
    window.location.href = 'perfil.html';
}

// Redireciona o usuário para a página de perfil, na seção de empréstimos.
function emprestimos(){
    window.location.href = 'perfil.html';
}