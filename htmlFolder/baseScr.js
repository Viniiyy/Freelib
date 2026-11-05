const usuarioId = sessionStorage.getItem('usuarioId');
const tipoConta = sessionStorage.getItem('tipoConta');

// Só entra quem fez login
if (!usuarioId) {
    window.location.href = 'login.html';
}

// Ajuste os destinos conforme suas páginas
const PAGINAS = {
    principal: 'homeS.html',
    emprestimos: 'perfil.html',
    Lemprestimos: 'ListEmprestimo.html',
    Lperfil: 'ListPerfies.html',
    AddLivros: 'AddLivro.html',
    AddCategorias: 'AddCategoria.html',
    config: 'config.html',
    login: 'login.html',
};


const NAVBAR_HTML_USER = `
<nav class="navbar" style="background-color: #D9D9D9;">
    <div class="container-fluid">
        <button class="btn" style="background-color: #223146; color: white" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions">
            <span class="navbar-toggler-icon" style="filter: brightness(0) invert(1);"></span>
        </button>

        <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1"
             id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div class="offcanvas-header" style="background-color: #223146;">
                <h5 class="offcanvas-title text-light" id="offcanvasWithBothOptionsLabel">Menu</h5>
                <button type="button" style="filter: brightness(0) invert(1);" class="btn-close"
                        data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="d-flex flex-column align-items-center gap-2">
                    <button data-destino="principal" class="btn w-100 py-4" style="border-color: #223146;">Página principal</button>
                    <button data-destino="emprestimos" class="btn w-100 py-4" style="border-color: #223146;">Empréstimos</button>
                </div>
                <div class="mt-4 text-center">
                    <button id="btn-sair" class="btn btn-danger mb-2">Sair</button>
                    <button data-destino="config" class="btn btn-danger mb-2">Config</button>
                </div>
            </div>
        </div>

        <form id="form-busca" class="d-flex w-75" role="search">
            <input type="search" id="campo-busca" class="form-control me-2"
                   style="border-color: #223146;" placeholder="Pesquisar" aria-label="search">
            <button class="btn" style="border-color: #223146;" type="submit">Pesquisar</button>
        </form>
    </div>
</nav>
`;

const NAVBAR_HTML_FUNC = `
<nav class="navbar" style="background-color: #D9D9D9;">
    <div class="container-fluid">
        <button class="btn" style="background-color: #223146; color: white" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions">
            <span class="navbar-toggler-icon" style="filter: brightness(0) invert(1);"></span>
        </button>

        <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1"
             id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div class="offcanvas-header" style="background-color: #223146;">
                <h5 class="offcanvas-title text-light" id="offcanvasWithBothOptionsLabel">Menu</h5>
                <button type="button" style="filter: brightness(0) invert(1);" class="btn-close"
                        data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="d-flex flex-column align-items-center gap-2">
                    <button data-destino="principal" class="btn w-100 py-4" style="border-color: #223146;">Página principal</button>
                    <button data-destino="emprestimos" class="btn w-100 py-4" style="border-color: #223146;">Empréstimos</button>
                    <button data-destino="Lemprestimos" class="btn w-100 py-4" style="border-color: #223146;">Lista de Empréstimos</button>
                    <button data-destino="Lperfil" class="btn w-100 py-4" style="border-color: #223146;">Lista de Perfil</button>
                </div>
                <div class="mt-4 text-center">
                    <button id="btn-sair" class="btn btn-danger mb-2">Sair</button>
                    <button data-destino="config" class="btn btn-danger mb-2">Config</button>
                </div>
            </div>
        </div>

        <form id="form-busca" class="d-flex w-75" role="search">
            <input type="search" id="campo-busca" class="form-control me-2"
                   style="border-color: #223146;" placeholder="Pesquisar" aria-label="search">
            <button class="btn" style="border-color: #223146;" type="submit">Pesquisar</button>
        </form>
    </div>
</nav>
`;

const NAVBAR_HTML_ADM = `
<nav class="navbar" style="background-color: #D9D9D9;">
    <div class="container-fluid">
        <button class="btn" style="background-color: #223146; color: white" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions">
            <span class="navbar-toggler-icon" style="filter: brightness(0) invert(1);"></span>
        </button>

        <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1"
             id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div class="offcanvas-header" style="background-color: #223146;">
                <h5 class="offcanvas-title text-light" id="offcanvasWithBothOptionsLabel">Menu</h5>
                <button type="button" style="filter: brightness(0) invert(1);" class="btn-close"
                        data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="d-flex flex-column align-items-center gap-2">
                    <button data-destino="principal" class="btn w-100 py-4" style="border-color: #223146;">Página principal</button>
                    <button data-destino="emprestimos" class="btn w-100 py-4" style="border-color: #223146;">Empréstimos</button>
                    <button data-destino="Lemprestimos" class="btn w-100 py-4" style="border-color: #223146;">Lista de Empréstimos</button>
                    <button data-destino="Lperfil" class="btn w-100 py-4" style="border-color: #223146;">Lista de Perfil</button>
                    <button data-destino="AddLivros" class="btn w-100 py-4" style="border-color: #223146;">Adicionar Livros</button>
                    <button data-destino="AddCategorias" class="btn w-100 py-4" style="border-color: #223146;">Adicionar Categorias</button>
                </div>
                <div class="mt-4 text-center">
                    <button id="btn-sair" class="btn btn-danger mb-2">Sair</button>
                    <button data-destino="config" class="btn btn-danger mb-2">Config</button>
                </div>
            </div>
        </div>

        <form id="form-busca" class="d-flex w-75" role="search">
            <input type="search" id="campo-busca" class="form-control me-2"
                   style="border-color: #223146;" placeholder="Pesquisar" aria-label="search">
            <button class="btn" style="border-color: #223146;" type="submit">Pesquisar</button>
        </form>
    </div>
</nav>
`;
if(tipoConta == 'adm') {
    document.getElementById('navbar').innerHTML = NAVBAR_HTML_ADM;
}else if(tipoConta == 'funcionario'){
    document.getElementById('navbar').innerHTML = NAVBAR_HTML_FUNC;
}else if(tipoConta == 'usuario') {
    document.getElementById('navbar').innerHTML = NAVBAR_HTML_USER;
}


// Botões de navegação do menu
document.querySelectorAll('#navbar [data-destino]').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = PAGINAS[btn.dataset.destino];
    });
});

// Sair
document.getElementById('btn-sair').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = PAGINAS.login;
});

// Pesquisa: leva para a página principal com ?busca=termo
const campoBusca = document.getElementById('campo-busca');
campoBusca.value = new URLSearchParams(window.location.search).get('busca') || '';

document.getElementById('form-busca').addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = campoBusca.value.trim();
    window.location.href = `${PAGINAS.principal}?busca=${encodeURIComponent(termo)}`;
});

// Mantidas porque outros scripts e onclicks já chamam estas funções
function perfil() { window.location.href = PAGINAS.perfil; }
function config() { window.location.href = PAGINAS.config; }