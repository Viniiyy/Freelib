const form = document.getElementById('form-login');
const msg = document.getElementById('msg');

function mostrarErro(texto) {
    msg.className = 'alert alert-danger';
    msg.textContent = texto;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resp = await fetch('http://127.0.0.1:8000/Login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const dados = await resp.json();

        if (!resp.ok) {
            mostrarErro(dados.erro || 'Não foi possível entrar.');
            return;
        }

        // Fica salvo só enquanto a aba estiver aberta
        sessionStorage.setItem('usuarioId', dados.id);
        sessionStorage.setItem('tipoConta', dados.tipo_conta);

        window.location.href = 'homeS.html';
    } catch (err) {
        mostrarErro('Não foi possível conectar ao servidor.');
    }
});