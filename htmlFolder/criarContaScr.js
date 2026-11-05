const form = document.getElementById('form-cadastro');
const msg = document.getElementById('msg');

function mostrarMsg(texto, tipo) {
    msg.className = `alert alert-${tipo}`;
    msg.textContent = texto;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = new FormData(form);
    // Envia só os dígitos do CPF
    dados.set('cpf', dados.get('cpf').replace(/\D/g, ''));

    try {
        const resp = await fetch('http://127.0.0.1:8000/Usuarios/', {
            method: 'POST',
            body: dados,
        });

        if (resp.ok) {
            mostrarMsg('Conta criada com sucesso!', 'success');
            // window.location.href = 'login.html';
            return;
        }

        const texto = await resp.text();
        console.error('Erro do servidor:', resp.status, texto);

        try {
            const erros = JSON.parse(texto);
            mostrarMsg(Object.values(erros).flat().join(' '), 'danger');
        } catch {
            mostrarMsg(`Erro ${resp.status} no servidor. Veja o console.`, 'danger');
        }
    } catch (err) {
        mostrarMsg('Não foi possível conectar ao servidor.', 'danger');
    }
});