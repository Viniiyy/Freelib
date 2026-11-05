const usuarioIdT = sessionStorage.getItem('usuarioId');


if(!usuarioId) {
    window.location.href = 'login.html'
}


fetch(`http://127.0.0.1:8000/Usuarios/${usuarioIdT}/`)
    .then(response => response.json())
    .then(user => {
    const userInfo = document.getElementById('userInfo');
    const userName = user.nome;
    const userFt = user.fotoPerfil;
    const userInf = document.createElement('div');
    userInf.innerHTML = `
    <span>${userName}</span>    
    <img src="${userFt}" alt="Perfil" class="rounded-circle"style="width: 40px; height: 40px object-fit: cover; margin-right: 10px;">
    `;
    userInfo.appendChild(userInf);
})


fetch(`http://127.0.0.1:8000/Usuarios/${usuarioIdT}/emprestimos/`)
    .then(response => response.json())
    .then(emprestimos =>{
        const userEmprest = document.getElementById('pagebody')
        if(!emprestimos || emprestimos.length === 0) {
            alert("Você não tem livros emprestados")
            return;
        }
        emprestimos.forEach(emprestimo =>{
            const livroId =  emprestimo.livro
            const dtDevolucao = emprestimo.data_devolucao
            const atraso = new Date(dtDevolucao) <  new Date()
            const Cfundo = atraso ? '#D08787' : '#D9D9D9'
            const textt = atraso ? 'Atrasado':'Devolução'
            fetch(`http://127.0.0.1:8000/Livros/${livroId}/`)
                .then(response => response.json())
                .then(livro => {
                    const card = document.createElement('div');
                    card.className = 'col-auto';
                    card.innerHTML = `
                        <div class="card rounded-5 text-center h-100 d-flex flex-column" style="width: 13rem; ">
                            <img src="${livro.imagem}" class="card-img-top rounded-top-5"  aLt="...">
                            <div class="card-body rounded-bottom-5" style="background-color: #284d81;">
                                <div class="h-100 w-100 rounded-5" style="background-color: ${Cfundo};" >
                                    <p class="card-text text-black">
                                        ${textt} - ${dtDevolucao}
                                    </p>
                                </div>
                                
                            </div>
                        </div>

                    `
                    userEmprest.appendChild(card)
                })
                .catch(error => {
                    console.error('Erro ao buscar livros:', error);
                });
        })

    })
    .catch(error => {
        console.error('Erro ao buscar da API:', error);
    });


    function homep(){
        window.location.href = 'homeS.html'
    }
    function favoritos(){
        window.location.href = 'perfil.html'
    }
    function emprestimos(){
        window.location.href = 'perfil.html'
    }

