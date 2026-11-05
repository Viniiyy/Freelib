const formulario = document.getElementById('formCategoria');
const msg = document.getElementById('msg');

const usuarioIdT = sessionStorage.getItem('usuarioId');
const tipoContaT = sessionStorage.getItem('tipoConta');

if(!usuarioIdT) {
    window.location.href = 'login.html'
}

if(tipoContaT != 'adm') {
    window.location.href = 'homeS.html'
}



formulario.addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData();
        formData.append('categoria', document.getElementById('Ncategoria').value);

    fetch('http://127.0.0.1:8000/Categorias/', {
        method: 'POST',
        body: formData
    })

    .then(response => response.json())
    .then(data => {
        console.log("Sucesso:", data);
        msg.textContent = "Categoria adicionado com sucesso!";
        formulario.reset();
    })
    .catch(error => {
        console.error('Erro ao enviar os dados:', error);
        msg.textContent = "Erro ao adicionar Categoria";
    });
})

function homePage() {
    window.location.href = 'homeS.html'
}