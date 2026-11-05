


fetch('http://127.0.0.1:8000/Livros/')
    .then(response => response.json())
    .then(livros => {
        const list = document.getElementById('listLivros');
        livros.forEach(livro => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            li.innerHTML = `
                <div>
                    <img src="${livro.imagem}" style="width: 100px; height: 150px;">
                    <h5>${livro.titulo}</h5>
                    <p>${livro.descricao}</p>
                    <small>${livro.situacao} - ${livro.dataEntrada} - ${livro.categoria.categoria}</small>
                </div>
                <div>
                    <a href = "editar.html?id=${livro.id}" class="btn btn-sm btn-primary">
                        editar
                    </a>
                    <button id = "lista" class="btn btn-sm btn-danger" onclick="excluirLivro(${livro.id})">
                        excluir
                    </button>
                </div>
            `;

            list.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar da API:', error);
        document.getElementById('listLivros').innerHTML = '<p>Erro ao buscar da API</p>';
    });


function excluirLivro(id){
    fetch(`http://127.0.0.1:8000/Livros/${id}/`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'listBook.html';
        } else {
            alert('Erro ao excluir o livro.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir o livro:', error);
        alert('Erro ao excluir o livro.');
    });
}
