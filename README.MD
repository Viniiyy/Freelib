<img src="logo/logo.png" alt="Logo" width="200" />
# Guia do Projeto FreeLib

**Como abrir, configurar e executar o sistema de empréstimo de livros no Windows com PowerShell**

| Item | Detalhe |
| :--- | :--- |
| **Pasta do projeto** | `C:\Users\~~~~\~~~~\~~~~\Free_lib` |
| **Linguagem** | Python 3.13.14 |
| **Framework** | Django 6.1.2 + Django REST Framework |
| **Banco de dados** | MySQL Server (banco: `bookstore`) |
| **Controle de versão** | Git e GitHub (`main`) |
| **Terminal** | PowerShell (Windows) |

---

## Sumário

1. [Visão geral do projeto e tecnologias](#1-visão-geral-do-projeto-e-tecnologias)
2. [Entendendo o ambiente virtual (.venv)](#2-entendendo-o-ambiente-virtual-venv)
3. [Passo a passo: abrir, configurar e executar](#3-passo-a-passo-abrir-configurar-e-executar)
4. [Comandos úteis de manutenção](#4-comandos-úteis-de-manutenção)
5. [Problemas comuns e como resolver](#5-problemas-comuns-e-como-resolver)
6. [Checklist rápido (resumo)](#6-checklist-rápido-resumo)

---

## 1. Visão geral do projeto e tecnologias

O projeto é um sistema web de biblioteca, feito com Python e Django, que guarda livros, categorias, usuários e empréstimos em um banco MySQL. Ele também expõe endpoints de API (via Django REST Framework) e uma documentação interativa no estilo Swagger.

| Tecnologia | Tipo | Para que serve no projeto |
| :--- | :--- | :--- |
| **Python 3.13.14** | Linguagem | Escreve a aplicação e executa o Django. |
| **Django 6.1.2** | Framework web | Gerencia modelos, rotas, configurações, migrações e o servidor de desenvolvimento. |
| **Django REST Framework (DRF)** | Framework de API REST | Cria os endpoints de API e estrutura as respostas da aplicação. |
| **MySQL Server** | Banco de dados | Armazena livros, categorias, usuários e empréstimos. O banco utilizado se chama `bookstore`. |
| **Pillow** | Processamento de imagens | Dá suporte aos campos `ImageField`, usados nas imagens dos livros e nas fotos de perfil. |
| **drf-yasg** | Documentação de API | Gera a documentação interativa da API (Swagger/OpenAPI). |
| **mysqlclient (MySQLdb)** | Driver | Permite que o Django converse com o MySQL. |
| **`.venv`** | Ambiente virtual | Isola as dependências do projeto (explicado em detalhes na próxima seção). |
| **PowerShell** | Terminal | Onde os comandos deste guia são executados. |
| **Git e GitHub** | Controle de versão | Guarda o histórico do código; a branch usada foi a `v7`. |

> **Dica:** Para confirmar as versões exatas instaladas, use `python -m pip freeze`.

---

## 2. Entendendo o ambiente virtual (.venv)

### 2.1. O que é?

Um ambiente virtual é uma pasta que contém uma cópia isolada do interpretador Python e um espaço próprio para instalar bibliotecas. No seu projeto ele fica na pasta `venv`, dentro de `ma-Biblioteca`. O ponto no início do nome é só uma convenção: ele indica que é uma pasta de apoio, não faz parte do código da aplicação.

### 2.2. Por que usar?

* **Isolamento:** o Django, o DRF e as demais bibliotecas ficam instalados só para este projeto, sem misturar com outros projetos ou com o Python do sistema.
* **Versões controladas:** cada projeto pode usar versões diferentes da mesma biblioteca sem conflito.
* **Reprodutibilidade:** qualquer pessoa (ou você, em outro computador) consegue recriar o mesmo ambiente.
* **Segurança:** instalar ou remover pacotes não bagunça o resto do computador.

### 2.3. O que existe dentro da pasta .venv?

| Item | Função |
| :--- | :--- |
| `Scripts\` | No Windows, guarda o `python.exe` do ambiente, o `pip` e os scripts de ativação (`Activate.ps1` para PowerShell, `activate.bat` para CMD). |
| `Lib\site-packages\` | Onde as bibliotecas instaladas (Django, DRF, Pillow etc.) realmente ficam. |
| `pyvenv.cfg` | Arquivo de configuração que registra qual Python foi usado para criar o ambiente. |

### 2.4. Criar o ambiente (só se ele ainda não existir)

Como o seu projeto já tem a pasta `venv`, normalmente você não precisa fazer isso. Mas em uma instalação nova, dentro da pasta do projeto, o comando é:

```powershell
python -m venv .venv
```

### 2.5. Ativar e desativar

```powershell
.\.venv\Scripts\Activate.ps1
```

Quando o ambiente está ativo, aparece `(.venv)` no começo da linha do terminal. A partir daí, os comandos `python` e `pip` usam o que está dentro do `.venv`. Para sair do ambiente:

```powershell
deactivate
```

### 2.6. Como conferir se está usando o ambiente certo

```powershell
Get-Command python
python --version
python -m pip --version
```

O primeiro comando deve mostrar um caminho que termina em `.\ma-Biblioteca\.venv\Scripts\python.exe`. Se mostrar outro caminho, o ambiente não está ativo.

### 2.7. Erro de execução de scripts no PowerShell

Em alguns computadores o PowerShell bloqueia a ativação com uma mensagem dizendo que a execução de scripts está desabilitada. Para liberar apenas para o seu usuário, execute:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Confirme com `S` (Sim) se o PowerShell pedir, e rode o comando de ativação novamente.

### 2.8. Registrar as dependências (requirements.txt)

Com o ambiente ativo, este comando salva a lista de pacotes e versões instalados em um arquivo. Assim você (ou outra pessoa) recria o mesmo ambiente depois:

```powershell
python -m pip freeze > requirements.txt
```

Para instalar tudo a partir desse arquivo em um ambiente novo:

```powershell
python -m pip install -r requirements.txt
```

### 2.9. Boas práticas com o .venv

* Não envie o `.venv` para o GitHub. Ele é grande e específico do seu computador. Adicione `.venv/` ao arquivo `.gitignore` e versione apenas o `requirements.txt`.
* Não mova nem renomeie a pasta do projeto com o ambiente ativo: os scripts guardam caminhos absolutos e podem parar de funcionar. Se precisar mover, apague o `venv` e crie de novo.
* Prefira `python -m pip` em vez de apenas `pip`, para garantir que o `pip` é o do ambiente ativo.
* Ativou o ambiente em um terminal? Cada janela nova do PowerShell precisa ativar de novo.
* Ambiente com problemas? Apagar a pasta `venv` e recriá-lo (com os comandos acima) é seguro, porque o código do projeto não fica dentro dela.

> **Dica:** No VS Code, selecione o interpretador do projeto em `Ctrl+Shift+P` > `Python: Select Interpreter` e escolha o que está em `.venv`. Assim o editor reconhece as bibliotecas instaladas.

---

## 3. Passo a passo: abrir, configurar e executar

Todos os comandos abaixo são para Windows com PowerShell.

### Etapa 1 - Entrar na pasta do projeto

```powershell
cd "C:\~~~~\~~~~~~~~~~~~\Free_lib"
```

Confira se está no lugar certo:

```powershell
Get-Location
dir manage.py
```

O segundo comando deve encontrar o arquivo `manage.py`. Se ele não aparecer, você está na pasta errada.

### Etapa 2 - Ativar o ambiente virtual

```powershell
.\.venv\Scripts\Activate.ps1
```

Se aparecer `(.venv)` no início do terminal, está ativo. Confira as versões:

```powershell
python --version
python -m pip --version
```

### Etapa 3 - Instalar as dependências

Instale as bibliotecas principais:

```powershell
python -m pip install Django djangorestframework drf-yasg mysqlclient Pillow
```

> **Atenção:** o segundo comando instala as bibliotecas, mas não garante as mesmas versões usadas originalmente. Faça verificações de funcionamento antes de colocar o projeto online.

### Etapa 4 - Iniciar e configurar o MySQL

Confirme que o MySQL Server está instalado e em execução. O projeto está configurado assim:

| Configuração | Valor |
| :--- | :--- |
| **Banco de dados** | `bookstore` |
| **Servidor** | `localhost` |
| **Porta** | `3306` |
| **Usuário** | `root` |
| **Charset** | `utf8mb4` |

> **Atenção:** tome cuidado ao definir a senha, a porta e os outros dados de conexão. Eles precisam ser exatamente iguais nos dois lugares: no MySQL Server e nas configurações do Django (bloco `DATABASES` do arquivo `settings.py`: `NAME`, `USER`, `PASSWORD`, `HOST` e `PORT`). Qualquer diferença, mesmo de maiúscula/minúscula ou espaço, causa erro de conexão.

O banco `bookstore` já foi criado e as tabelas foram recriadas pelas migrações. Se ele continua existindo, não precisa criar de novo. Em uma instalação nova, entre no cliente MySQL e execute:

```sql
CREATE DATABASE bookstore
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

A senha do banco deve corresponder à configuração local do projeto (arquivo de configurações do Django). Não é necessário digitar a senha nos comandos do terminal.

### Etapa 5 - Aplicar as migrações

Migrações são arquivos que descrevem a estrutura das tabelas. Dentro da pasta que contém o `manage.py`, veja o estado atual e depois aplique:

```powershell
python manage.py showmigrations
python manage.py migrate
```

O Django cria ou atualiza as tabelas conforme as migrações registradas no projeto.

### Etapa 6 - Executar o servidor

```powershell
python manage.py runserver
```

Se tudo estiver correto, o terminal mostrará um endereço parecido com `http://127.0.0.1:8000/`. Abra no navegador. Para acessar a rota de livros que você já testou, use:

* `http://127.0.0.1:8000/Livros/`

Para parar o servidor, pressione `Ctrl + C` no terminal.

---

## 4. Comandos úteis de manutenção

| Comando | Para que serve |
| :--- | :--- |
| `python manage.py check` | Verifica problemas na configuração do Django. |
| `python manage.py makemigrations` | Gera migrações para alterações nos modelos. |
| `python manage.py migrate` | Aplica as migrações ao banco. |
| `python manage.py showmigrations` | Mostra quais migrações foram aplicadas. |
| `python manage.py createsuperuser` | Cria um usuário administrador do Django. |
| `python manage.py runserver` | Inicia o servidor de desenvolvimento. |
| `python -m pip list` | Lista os pacotes instalados no ambiente virtual. |
| `python -m pip freeze` | Lista os pacotes instalados com suas versões. |
| `git status` | Mostra as alterações no repositório Git. |
| `git branch` | Mostra as branches locais. |

> **Atenção:** só execute `makemigrations` quando houver alterações nos modelos que precisem ser registradas. Não é necessário rodá-lo toda vez que iniciar o projeto.

---

## 5. Problemas comuns e como resolver

| Sintoma | Causa provável | O que fazer |
| :--- | :--- | :--- |
| **PowerShell diz que a execução de scripts está desabilitada** | Política de execução bloqueando o `Activate.ps1` | Rode o `Set-ExecutionPolicy` da seção 2.7. |
| **`No module named 'django'`** | Ambiente virtual não ativado ou dependências não instaladas | Ative o `venv` (etapa 2) e instale as dependências (etapa 3). |
| **Erro ao conectar no MySQL (`access denied` / `can't connect`)** | MySQL desligado, senha diferente ou banco inexistente | Confirme que o MySQL está rodando, confira a senha nas configurações e se o banco `bookstore` existe. |
| **Erro ao instalar o `mysqlclient`** | Falta de compatibilidade com a versão do Python ou de ferramentas de compilação | Atualize o `pip` (`python -m pip install --upgrade pip`) e tente novamente; leia a mensagem de erro completa. |
| **`can't open file manage.py`** | Terminal na pasta errada | Use `cd` até a pasta que contém o `manage.py` (etapa 1). |
| **Imagens não funcionam (`ImageField`)** | Pillow não instalado | Execute `python -m pip install Pillow`. |
| **Porta 8000 em uso** | Outro servidor rodando | Feche o outro terminal ou use `python manage.py runserver 8001`. |

---

## 6. Checklist rápido (resumo)

Sempre que for abrir o projeto para trabalhar, siga esta sequência:

```powershell
cd "C:\~~~~\~~~~\~~~~\~~~~\Free_lib"
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

E antes disso, confirme que o MySQL Server está em execução. Para encerrar: `Ctrl + C` no servidor e depois `deactivate`.

# Detalhes do Programa

**Models, Serializers, Settings e URLs do projeto Biblioteca: o que cada parte faz e como elas se conectam**

| Parte | Papel no projeto |
| :--- | :--- |
| **Models** | Definem as tabelas do banco de dados (usuários, categorias, livros e empréstimos). |
| **Serializers** | Convertem os dados entre o banco e o formato JSON da API, e validam o que chega. |
| **Settings** | Reúnem as configurações gerais: apps, banco, segurança, idioma, mídia e CORS. |
| **URLs** | Ligam cada endereço da API (como `/Livros/`) ao código que responde a ele. |

---

## Sumário

1. [Visão geral: como as peças se conectam](#1-visão-geral-como-as-peças-se-conectam)
2. [Models (modelos do banco de dados)](#2-models-modelos-do-banco-de-dados)
3. [Serializers (conversão e validação dos dados)](#3-serializers-conversão-e-validação-dos-dados)
4. [Settings (configurações do projeto)](#4-settings-configurações-do-projeto)
5. [URLs (rotas da aplicação)](#5-urls-rotas-da-aplicação)
6. [Exemplo completo: o cadastro de um usuário](#6-exemplo-completo-o-cadastro-de-um-usuário)
7. [Pontos de atenção e melhorias sugeridas](#7-pontos-de-atenção-e-melhorias-sugeridas)

> **Dica:** Este guia explica apenas os arquivos de `models`, `serializers`, `settings` e `urls`. Os ViewSets (`bookstore.api.viewsets`) e as views não fizeram parte do material, então aparecem só como "a peça que recebe a requisição".

---

## 1. Visão geral: como as peças se conectam

Quando o front-end (ou o Swagger) faz uma requisição para a API, ela atravessa quatro camadas, nesta ordem:

| Camada | Onde fica | O que faz |
| :--- | :--- | :--- |
| **1. URLs** | `urls.py` do projeto (`setup`) | Recebe o endereço (ex.: `/Livros/`) e escolhe qual ViewSet responde. |
| **2. ViewSet** | `bookstore.api.viewsets` | Trata a requisição (listar, criar, editar, apagar). |
| **3. Serializer** | Arquivo de serializers do app | Valida os dados recebidos e converte models em JSON (e vice-versa). |
| **4. Model** | `models.py` do app `bookstore` | Representa a tabela e grava ou lê no MySQL. |

O `settings.py` não faz parte desse caminho, mas comanda tudo: diz quais apps existem, como conectar no banco, onde ficam as imagens e quais tipos de conta existem.

O projeto tem dois níveis, como é padrão no Django:

* **`setup`:** o projeto em si, com as configurações (`settings`) e as rotas principais (`urls`).
* **`bookstore`:** o app da biblioteca, com os models, a API e os arquivos estáticos.

---

## 2. Models (modelos do banco de dados)

Cada model é uma classe Python que o Django transforma em uma tabela do MySQL. Cada atributo vira uma coluna. Como o app se chama `bookstore`, as tabelas ficam com nomes como `bookstore_usuario`, `bookstore_livro`, `bookstore_categoria` e `bookstore_emprestimo`. O campo `id` não aparece no código porque o Django o cria sozinho (tipo `BigAutoField`, definido em `DEFAULT_AUTO_FIELD`).

> **Dica:** Sempre que você alterar um model, rode `python manage.py makemigrations` e depois `python manage.py migrate` para o banco acompanhar a mudança.

### 2.1. RenameImage: nome único para as imagens

Não é uma tabela, e sim uma classe auxiliar usada no parâmetro `upload_to` dos campos de imagem. Ela recebe a pasta de destino, pega a extensão do arquivo enviado e gera um nome novo com `uuid.uuid4()`. Assim duas fotos com o mesmo nome original nunca se sobrescrevem, e o nome original do arquivo não fica exposto.

```text
# Exemplo do resultado
foto enviada: minha foto.jpg
salva como: ftPerfil/3f2b8c1e-9a7d.jpg (dentro de MEDIA_ROOT)
```
*(Exemplo do resultado de renomeação automática de imagens.)*

O decorador `@deconstructible` é necessário para o Django conseguir registrar esse objeto nas migrações.

### 2.2. Usuario

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| **`fotoPerfil`** | `ImageField` | Salva em `ftPerfil/` com nome UUID. Como não tem `blank=True`, é obrigatório. |
| **`nome`** | `CharField(100)` | Nome completo. |
| **`email`** | `EmailField`, `unique` | Único: o banco rejeita dois cadastros com o mesmo e-mail. |
| **`senha`** | `CharField(128)` | Guarda o hash da senha (não o texto puro). 128 caracteres comportam o hash gerado pelo Django. |
| **`cpf`** | `CharField(11)` | Texto, e não número, para preservar zeros à esquerda. Não há validação de formato. |
| **`tipo_conta`** | `CharField(20)`, `choices` | `usuario`, `funcionario` ou `adm`. Padrão: `usuario`. Com `editable=False`, não pode ser alterado por formulários. |

#### Tipos de conta (`TipoConta`)

| Valor salvo | Rótulo | Como é definido / o que o model oferece |
| :--- | :--- | :--- |
| **`usuario`** | Usuário | Tipo padrão (e-mail sem sufixo especial). É o único com `pode_emprestar = True`. |
| **`funcionario`** | Funcionário | E-mails terminados em `@biblioteca.com`. Propriedade `is_funcionario`. |
| **`adm`** | Administrador | E-mails terminados em `.gov` ou `.gov.br`. Propriedade `is_adm`. |

#### Como o tipo de conta é definido

O método estático `tipo_por_email(email)` limpa o e-mail (`strip` e `lower`), percorre o dicionário `TIPO_CONTA_POR_EMAIL` do `settings.py` e verifica se o e-mail termina com algum dos sufixos de cada tipo. O primeiro tipo que combinar vence; se nenhum combinar, o resultado é `usuario`.

```python
def save(self, *args, **kwargs):
    self.tipo_conta = self.tipo_por_email(self.email)
    super().save(*args, **kwargs)
```
*(Sobrescrita do método `save()` no model `Usuario`.)*

O `save()` foi sobrescrito para recalcular o tipo a cada gravação. Por isso o tipo nunca vem do cliente: depende só do e-mail.

| E-mail | Sufixo que combina | Tipo resultante |
| :--- | :--- | :--- |
| `ana@prefeitura.gov.br` | `.gov.br` | `adm` |
| `joao@biblioteca.com` | `@biblioteca.com` | `funcionario` |
| `maria@gmail.com` | *(nenhum)* | `usuario`  |

#### Propriedades auxiliares

`is_adm`, `is_funcionario` e `pode_emprestar` são atalhos que retornam `True` ou `False` conforme o tipo. Por serem propriedades Python, não são colunas do banco e não podem ser usadas em filtros como `Usuario.objects.filter(is_adm=True)`; nesse caso filtre por `tipo_conta='adm'`.

> **Atenção:** se você mudar o `TIPO_CONTA_POR_EMAIL` no `settings.py`, usuários já cadastrados só terão o tipo atualizado na próxima vez que forem salvos.

### 2.3. Categoria

Tabela simples com um único campo, `categoria` (texto de até 100 caracteres), além do `id` automático. Serve para organizar os livros.

### 2.4. Livro

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| **`imagem`** | `ImageField` | Capa do livro, salva em `images/` com nome UUID. |
| **`titulo`** | `CharField(50)` | Título. |
| **`descricao`** | `TextField` | Texto longo, sem limite de tamanho. |
| **`dataEntrada`** | `DateField` | Data em que o livro entrou na biblioteca. |
| **`categoria`** | `ForeignKey(Categoria)` | Liga o livro a uma categoria. |
| **`situacao`** | `CharField(15)` | Situação atual (texto livre, como `"disponível"`). |

### 2.5. Emprestimo

Liga um usuário a um livro em um período. Tem as chaves estrangeiras `livro` e `usuario`, mais as datas `data_emprestimo` e `data_devolucao` (prevista).

### 2.6. Relacionamentos e o que acontece ao apagar

O parâmetro `on_delete` define o que o Django faz quando o registro referenciado é apagado:

| Relação | `on_delete` | Efeito |
| :--- | :--- | :--- |
| **Livro > Categoria** | `DO_NOTHING` | O Django não faz nada. Como o MySQL tem a restrição de chave estrangeira, apagar uma categoria que ainda tem livros gera erro de integridade. |
| **Emprestimo > Livro** | `CASCADE` | Apagar um livro apaga também seus empréstimos. |
| **Emprestimo > Usuario** | `CASCADE` | Apagar um usuário apaga também seus empréstimos. |

Em resumo: uma `Categoria` tem vários `Livros`; um `Livro` e um `Usuario` se relacionam por meio de vários `Emprestimos` (a tabela de empréstimos é a ponte entre eles).

---

## 3. Serializers (conversão e validação dos dados)

A API conversa em JSON, mas o banco guarda objetos Python (models). O serializer faz a tradução nos dois sentidos e ainda valida os dados que chegam antes de gravar. O projeto usa `ModelSerializer`, que monta os campos automaticamente a partir do model.

Em todos os serializers aparece a mesma estrutura:

```python
class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Livro
        fields = '__all__'
        extra_kwargs = {...}
```
*(Estrutura padrão dos serializers do projeto.)*

| Elemento | Função |
| :--- | :--- |
| **`model`** | Diz de qual model os campos serão gerados. |
| **`fields = '__all__'`** | Expõe todos os campos do model na API. |
| **`extra_kwargs`** | Ajusta opções por campo. Aqui é usado para o `help_text`, a descrição que aparece na documentação Swagger e Redoc. |

### 3.1. Os quatro serializers principais

| Serializer | Model | Particularidades |
| :--- | :--- | :--- |
| **`CategoriaSerializer`** | `Categoria` | Apenas `help_text` para `id` e `categoria`. |
| **`LivroSerializer`** | `Livro` | O `help_text` de `categoria` orienta a buscar o ID no `GET` da API de Categoria. |
| **`EmprestimoSerializer`** | `Emprestimo` | O `help_text` de `livro` e `usuario` orienta de onde pegar os IDs. |
| **`UsuarioSerializer`** | `Usuario` | Tem regras especiais de segurança (seção 3.2). |

Como as relações são chaves estrangeiras, na API elas são informadas pelo ID do registro relacionado. Por isso os textos de ajuda mandam consultar o `GET` da outra API antes.

### 3.2. UsuarioSerializer: as regras de segurança

| Configuração | Efeito |
| :--- | :--- |
| **`read_only_fields = ['tipo_conta']`** | O cliente não consegue enviar nem alterar o tipo de conta pela API. Ele é calculado pelo e-mail no model. |
| **`'senha': {'write_only': True}`** | A senha pode ser enviada, mas nunca é devolvida nas respostas da API. |
| **`validate_senha(self, valor)`** | O DRF chama métodos `validate_<campo>` automaticamente. Este troca a senha enviada pelo hash gerado por `make_password`, que é o que será gravado no banco. |

```python
def validate_senha(self, valor):
    return make_password(valor)
```
*(Validação e encriptação da senha no `UsuarioSerializer`.)*

**Resultado:** o banco nunca guarda a senha em texto puro. Para conferir a senha no login, o código precisa usar `check_password` (do Django), que compara a senha digitada com o hash.

### 3.3. UsuarioEmprestimosSerializer

Serializer pensado para mostrar os empréstimos de um usuário, com dois campos de texto declarados manualmente: `nome` e `LivroEmp`. Ele não tem classe `Meta`, ou seja, não está ligado a nenhum model; os dados precisam ser montados pela view. Veja a observação sobre ele na seção 7.

---

## 4. Settings (configurações do projeto)

O `settings.py` é lido pelo Django ao iniciar. Cada bloco configura uma parte do sistema:

| Configuração | O que faz |
| :--- | :--- |
| **`BASE_DIR`** | Pasta raiz do projeto, calculada a partir do próprio arquivo. Serve de base para outros caminhos. |
| **`SECRET_KEY`** | Chave usada em operações criptográficas (sessões, tokens). Deve ser secreta. *(Valor omitido neste guia.)* |
| **`DEBUG = True`** | Modo de desenvolvimento: mostra páginas de erro detalhadas e serve arquivos de mídia. |
| **`ALLOWED_HOSTS = []`** | Lista de domínios permitidos. Vazia funciona em desenvolvimento local; em produção deve listar os domínios. |
| **`INSTALLED_APPS`** | Apps ativos: os do Django (`admin`, `auth`, `sessions`...), mais `rest_framework` (API), `drf_yasg` (Swagger/Redoc), `bookstore` (seu app) e `corsheaders` (CORS). |
| **`TIPO_CONTA_POR_EMAIL`** | Configuração própria do projeto: dicionário com os sufixos de e-mail de cada tipo de conta (seção 4.1). |
| **`MIDDLEWARE`** | Camadas que processam toda requisição: segurança, sessão, CSRF, autenticação, mensagens, clickjacking e CORS. |
| **`ROOT_URLCONF`** | Aponta o arquivo de rotas principal: `setup.urls`. |
| **`TEMPLATES`** | Configura os templates HTML do Django (usados, por exemplo, pelo painel admin). |
| **`WSGI_APPLICATION`** | Ponto de entrada para servidores web em produção. |
| **`DATABASES`** | Conexão com o MySQL (seção 4.2). |
| **`AUTH_PASSWORD_VALIDATORS`** | Regras de senha do sistema de usuários do Django (similaridade, tamanho mínimo, senhas comuns, só números). |
| **`LANGUAGE_CODE` / `TIME_ZONE`** | Idioma `pt-br` e fuso `America/Sao_Paulo`. `USE_TZ = True` guarda datas com fuso horário. |
| **`STATIC_URL` / `STATICFILES_DIRS`** | Arquivos estáticos (como os scripts JS do front) servidos em `/static/`, buscados em `bookstore/static/scripts`. |
| **`DEFAULT_AUTO_FIELD`** | Tipo do `id` criado automaticamente nos models (`BigAutoField`). |
| **`CORS_ALLOW_ALL_ORIGINS = True`** | Permite que páginas de qualquer origem chamem a API (necessário quando o front roda em endereço/porta diferentes). |
| **`MEDIA_URL` / `MEDIA_ROOT`** | Arquivos enviados pelos usuários (fotos e capas): acessados em `/media/` e gravados na pasta `media/` do projeto. |

### 4.1. TIPO_CONTA_POR_EMAIL

```python
TIPO_CONTA_POR_EMAIL = {
    "adm": [".gov", ".gov.br"],
    "funcionario": ["@biblioteca.com"],
}
```
*(Dicionário de mapeamento de sufixos de e-mail em `settings.py`.)*

Cada chave é um tipo de conta e cada valor é uma lista de sufixos. O model compara o final do e-mail com esses sufixos. Note que `.gov.br` precisa estar na lista separadamente, pois um e-mail terminado em `.gov.br` não termina em `.gov`. Para incluir um novo tipo de e-mail, basta adicionar um sufixo à lista correspondente, sem mexer no model.

### 4.2. DATABASES (MySQL)

| Chave | Valor | Significado |
| :--- | :--- | :--- |
| **`ENGINE`** | `django.db.backends.mysql` | Usa o MySQL (por meio do `mysqlclient`). |
| **`NAME`** | `bookstore` | Nome do banco. |
| **`USER`** | `root` | Usuário de conexão. |
| **`PASSWORD`** | *(omitida neste guia)* | Senha do usuário no MySQL. |
| **`HOST`** | `localhost` | Servidor do MySQL (a própria máquina). |
| **`PORT`** | `3306` | Porta padrão do MySQL. |
| **`OPTIONS: charset`** | `utf8mb4` | Aceita acentos, caracteres especiais e emojis. |

### 4.3. Arquivos estáticos e de mídia: qual a diferença?

| Aspecto | Estáticos | Mídia |
| :--- | :--- | :--- |
| **O que são** | Arquivos do próprio sistema (JS, CSS, imagens do layout). | Arquivos enviados pelos usuários (fotos de perfil, capas de livros). |
| **URL** | `/static/` | `/media/` |
| **Pasta** | `bookstore/static/scripts` | `media/` (`MEDIA_ROOT`) |
| **Quem alimenta** | Você, ao programar. | Os usuários, pela API (campos `ImageField`). |

---

## 5. URLs (rotas da aplicação)

O arquivo de URLs diz ao Django qual código responde a cada endereço. Ele tem quatro partes:

### 5.1. Documentação da API (`schema_view`)

A função `get_schema_view`, do `drf-yasg`, descreve a API (título `"Bookstore API"`, versão `v1`, licença e contato) e gera os documentos Swagger e Redoc. Com `public=True` e `AllowAny`, qualquer pessoa pode abrir a documentação.

### 5.2. O roteador (`DefaultRouter`)

Em vez de escrever uma rota por operação, o projeto registra cada ViewSet no roteador e ele cria as rotas sozinho:

```python
route = routers.DefaultRouter()
route.register(r'Livros', viewsets.LivroViewSet, basename='Livros')
```
*(Registro de ViewSet no roteador do Django REST Framework.)*

Para cada registro, o roteador cria uma rota de coleção e uma de item. Supondo que os ViewSets sejam `ModelViewSet` (completos), o resultado é:

| Endereço | Método | Ação |
| :--- | :--- | :--- |
| `/Livros/` | `GET` | Lista todos os livros. |
| `/Livros/` | `POST` | Cadastra um livro. |
| `/Livros/<id>/` | `GET` | Mostra um livro. |
| `/Livros/<id>/` | `PUT`/`PATCH` | Altera um livro (completo / parcial). |
| `/Livros/<id>/` | `DELETE` | Apaga um livro. |

O mesmo vale para os outros três registros:

| Prefixo | ViewSet | Dados |
| :--- | :--- | :--- |
| `/Usuarios/` | `UsuarioViewSet` | Usuários e contas. |
| `/Livros/` | `LivroViewSet` | Livros. |
| `/Emprestimos/` | `EmprestimoViewSet` | Empréstimos. |
| `/Categorias/` | `CategoriaViewSet` | Categorias. |

O `DefaultRouter` também cria a página inicial da API em `/`, com a lista dos endereços registrados.

### 5.3. Rotas fixas

| Endereço | O que abre |
| :--- | :--- |
| `/admin/` | Painel administrativo do Django. |
| `/swagger/` | Documentação interativa (Swagger): permite testar a API pelo navegador. |
| `/redoc/` | Documentação em formato Redoc (leitura). |
| `/aswaggerjson/` | Arquivo JSON do esquema da API. |
| `/Login/` | Rota de login, tratada pela função `viewsets.login`. |
| `/media/...` | Imagens enviadas (só funciona com `DEBUG = True`). |

As rotas de mídia usam `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` dentro de um `if settings.DEBUG`. Isso é um recurso do servidor de desenvolvimento; em produção, o servidor web precisa servir a pasta `media` por conta própria.

---

## 6. Exemplo completo: o cadastro de um usuário

Veja como as quatro partes trabalham juntas quando o front envia um cadastro (supondo que o `UsuarioViewSet` use o `UsuarioSerializer`):

1. O front faz um `POST` para `http://127.0.0.1:8000/Usuarios/` com nome, e-mail, senha, cpf e a foto (como formulário com arquivo, por causa da imagem).
2. O CORS (`settings`) permite que a requisição venha de outra origem.
3. O `urls.py` encontra o prefixo `Usuarios` e entrega a requisição ao `UsuarioViewSet`.
4. O `UsuarioSerializer` valida os campos (e-mail único, tamanhos máximos, foto obrigatória) e ignora qualquer `tipo_conta` enviado, pois é somente leitura.
5. O `validate_senha` troca a senha pelo hash.
6. Ao gravar, o `Usuario.save()` consulta o `TIPO_CONTA_POR_EMAIL` e define o tipo de conta pelo e-mail.
7. O `RenameImage` dá um nome UUID à foto, que vai para a pasta `media/ftPerfil/` (`MEDIA_ROOT`).
8. O registro é gravado no MySQL (banco `bookstore`, tabela do app `bookstore`).
9. A resposta volta em JSON, sem a senha (`write_only`), já com o `tipo_conta` calculado.

---

## 7. Pontos de atenção e melhorias sugeridas

> Este projeto foi desenvolvido por um estudante universitário e, como parte de seu processo de desenvolvimento, pode apresentar erros, vulnerabilidades de segurança.
>
> Com o objetivo de identificar possíveis problemas, solicitei ao Claude AI versão Sonnet 5.5 uma análise do código, que apontou falhas, possíveis vulnerabilidades e sugestões de melhorias.
>
> Portanto, reforço que este projeto deve ser utilizado com cautela. Antes de aplicá-lo em qualquer ambiente real, recomendo que todo o código seja devidamente revisado, testado e, se necessário, corrigido por profissionais qualificados.
>
> O projeto é disponibilizado como uma iniciativa de aprendizado e desenvolvimento, não como uma solução pronta para uso em ambientes que exijam garantias de segurança e confiabilidade.

A lista abaixo não aponta erros de funcionamento: são cuidados e melhorias que valem a pena, em ordem aproximada de importância. Vários são aceitáveis em desenvolvimento, mas importam quando o projeto for usado de verdade.

| Item | Situação atual | Sugestão |
| :--- | :--- | :--- |
| **Senha do banco e `SECRET_KEY` no código** | Estão escritas diretamente no `settings.py`. Se o arquivo foi para o GitHub, qualquer pessoa com acesso ao repositório as vê. | Mover para variáveis de ambiente ou um arquivo `.env` fora do Git. Se já foram publicadas, trocar a senha do MySQL e gerar uma nova `SECRET_KEY`. |
| **Tipo de conta só pelo e-mail** | Qualquer pessoa pode se cadastrar com um e-mail terminado em `.gov` e virar administrador, pois o e-mail não é verificado. | Confirmar o e-mail (link de verificação) antes de conceder adm/funcionário, ou conceder esses tipos manualmente. |
| **API sem autenticação** | Não há bloco `REST_FRAMEWORK` no settings, então valem os padrões do DRF: sem exigir login. O Swagger também é público. | Definir autenticação e permissões (por exemplo, só adm cria livros e categorias). |
| **CORS liberado para todos** | `CORS_ALLOW_ALL_ORIGINS = True` permite que qualquer site chame a API. | Em produção, usar `CORS_ALLOWED_ORIGINS` com a lista dos endereços do front. |
| **`DEBUG` e `ALLOWED_HOSTS`** | `DEBUG = True` (aparece duas vezes no arquivo) e `ALLOWED_HOSTS` vazio. | Em produção: `DEBUG = False` e `ALLOWED_HOSTS` com os domínios. Remover a repetição. |
| **Posição do `CorsMiddleware`** | Está por último na lista `MIDDLEWARE`. | A documentação do `django-cors-headers` recomenda colocá-lo o mais acima possível, antes do `CommonMiddleware`. |
| **Caminho dos estáticos** | `'bookstore\static\scripts'` usa barra invertida em string comum. No Python 3.12+ o `\s` gera aviso de sequência inválida. | Usar `BASE_DIR / 'bookstore' / 'static' / 'scripts'` (funciona em qualquer sistema). |
| **`Livro.categoria` com `DO_NOTHING`** | Apagar uma categoria com livros causa erro de integridade no MySQL. | Usar `PROTECT` (erro claro e controlado) ou decidir o que acontece com os livros. |
| **`UsuarioEmprestimosSerializer`** | Herda de `ModelSerializer` mas não tem `Meta`. O DRF costuma exigir `Meta` em um `ModelSerializer` e pode dar erro ao usá-lo. | Se não estiver ligado a um model, herdar de `serializers.Serializer`. Vale testar o endpoint que o usa. |
| **`Livro.situacao` em texto livre** | Aceita qualquer texto, o que permite variações como `"Disponivel"` e `"disponível"`. | Usar `TextChoices`, como já foi feito em `Usuario.TipoConta`. |
| **CPF sem validação** | Aceita qualquer texto de até 11 caracteres e pode se repetir. | Validar 11 dígitos (e o dígito verificador) e avaliar `unique=True`. |
| **Detalhes de acabamento** | A rota `"aswaggerjson/"` parece ter uma letra `a` a mais; a descrição da API tem `"ssaida"`; o e-mail de contato é fictício; o import de `views` no `urls.py` parece não ser usado. | Corrigir o texto e remover o que não é usado. |

### Exemplo de leitura de variáveis de ambiente

Exemplo de como ler configurações sensíveis de variáveis de ambiente (apenas o trecho a adicionar ao `settings.py`):

```python
import os

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
# em DATABASES: 'PASSWORD': os.environ["DB_PASSWORD"],
```
*(Trecho de configuração via variáveis de ambiente no `settings.py`.)*

> **Dica:** Em desenvolvimento local, você pode definir a variável no PowerShell antes de rodar o servidor: `$env:DB_PASSWORD = "sua-senha"`. Ela vale só para aquela janela do terminal.
