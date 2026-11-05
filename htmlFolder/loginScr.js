// Recupera o formulário de login pelo seu identificador HTML.
const form = document.getElementById('form-login');

// Recupera o elemento responsável por exibir mensagens de erro.
const msg = document.getElementById('msg');

// Função responsável por exibir mensagens de erro na página.
function mostrarErro(texto) {

    // Define as classes do Bootstrap para apresentar um alerta de erro.
    msg.className = 'alert alert-danger';

    // Insere a mensagem de erro no elemento HTML.
    msg.textContent = texto;
}

// Adiciona um evento para capturar o envio do formulário de login.
form.addEventListener('submit', async (e) => {

    // Impede que a página seja recarregada ao enviar o formulário.
    e.preventDefault();

    // Recupera o email informado pelo usuário.
    const email = document.getElementById('email').value;

    // Recupera a senha informada pelo usuário.
    const senha = document.getElementById('senha').value;

    try {

        // Envia os dados de login para a API através de uma requisição POST.
        const resp = await fetch('http://127.0.0.1:8000/Login/', {
            method: 'POST',

            // Define que os dados enviados estarão no formato JSON.
            headers: { 'Content-Type': 'application/json' },

            // Converte o email e a senha para JSON antes de enviá-los.
            body: JSON.stringify({ email, senha }),
        });

        // Converte a resposta da API para JSON.
        const dados = await resp.json();

        // Verifica se a autenticação foi rejeitada pelo servidor.
        if (!resp.ok) {

            // Exibe a mensagem retornada pela API ou uma mensagem padrão.
            mostrarErro(dados.erro || 'Não foi possível entrar.');

            // Encerra a execução caso o login não seja bem-sucedido.
            return;
        }

        // Armazena o ID do usuário na sessão do navegador.
        // Os dados permanecem disponíveis enquanto a sessão da aba estiver ativa.
        sessionStorage.setItem('usuarioId', dados.id);

        // Armazena o tipo de conta do usuário na sessão.
        sessionStorage.setItem('tipoConta', dados.tipo_conta);

        // Redireciona o usuário para a página principal após o login.
        window.location.href = 'homeS.html';

    } catch (err) {

        // Exibe uma mensagem caso ocorra algum erro na comunicação com a API.
        mostrarErro('Não foi possível conectar ao servidor.');
    }
});