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

**Models, Serializers, Settings e URLs do projeto Biblioteca: o que cada parte faz e como elas se conectam**[cite: 9]

| Parte | Papel no projeto |
| :--- | :--- |
| **Models** | Definem as tabelas do banco de dados (usuários, categorias, livros e empréstimos).[cite: 9] |
| **Serializers** | Convertem os dados entre o banco e o formato JSON da API, e validam o que chega.[cite: 9] |
| **Settings** | Reúnem as configurações gerais: apps, banco, segurança, idioma, mídia e CORS.[cite: 9] |
| **URLs** | Ligam cada endereço da API (como `/Livros/`) ao código que responde a ele.[cite: 9] |

---

## Sumário

1. [Visão geral: como as peças se conectam](#1-visão-geral-como-as-peças-se-conectam)[cite: 10]
2. [Models (modelos do banco de dados)](#2-models-modelos-do-banco-de-dados)[cite: 10]
3. [Serializers (conversão e validação dos dados)](#3-serializers-conversão-e-validação-dos-dados)[cite: 10]
4. [Settings (configurações do projeto)](#4-settings-configurações-do-projeto)[cite: 10]
5. [URLs (rotas da aplicação)](#5-urls-rotas-da-aplicação)[cite: 10]
6. [Exemplo completo: o cadastro de um usuário](#6-exemplo-completo-o-cadastro-de-um-usuário)[cite: 10]
7. [Pontos de atenção e melhorias sugeridas](#7-pontos-de-atenção-e-melhorias-sugeridas)[cite: 10]

> **Dica:** Este guia explica apenas os arquivos de `models`, `serializers`, `settings` e `urls`.[cite: 10] Os ViewSets (`bookstore.api.viewsets`) e as views não fizeram parte do material, então aparecem só como "a peça que recebe a requisição".[cite: 10]

---

## 1. Visão geral: como as peças se conectam

Quando o front-end (ou o Swagger) faz uma requisição para a API, ela atravessa quatro camadas, nesta ordem:[cite: 11]

| Camada | Onde fica | O que faz |
| :--- | :--- | :--- |
| **1. URLs** | `urls.py` do projeto (`setup`)[cite: 11] | Recebe o endereço (ex.: `/Livros/`) e escolhe qual ViewSet responde.[cite: 11] |
| **2. ViewSet** | `bookstore.api.viewsets`[cite: 11] | Trata a requisição (listar, criar, editar, apagar).[cite: 11] |
| **3. Serializer** | Arquivo de serializers do app[cite: 11] | Valida os dados recebidos e converte models em JSON (e vice-versa).[cite: 11] |
| **4. Model** | `models.py` do app `bookstore`[cite: 11] | Representa a tabela e grava ou lê no MySQL.[cite: 11] |

O `settings.py` não faz parte desse caminho, mas comanda tudo: diz quais apps existem, como conectar no banco, onde ficam as imagens e quais tipos de conta existem.[cite: 11]

O projeto tem dois níveis, como é padrão no Django:[cite: 11]

* **`setup`:** o projeto em si, com as configurações (`settings`) e as rotas principais (`urls`).[cite: 11]
* **`bookstore`:** o app da biblioteca, com os models, a API e os arquivos estáticos.[cite: 11]

---

## 2. Models (modelos do banco de dados)

Cada model é uma classe Python que o Django transforma em uma tabela do MySQL.[cite: 12] Cada atributo vira uma coluna.[cite: 12] Como o app se chama `bookstore`, as tabelas ficam com nomes como `bookstore_usuario`, `bookstore_livro`, `bookstore_categoria` e `bookstore_emprestimo`.[cite: 12] O campo `id` não aparece no código porque o Django o cria sozinho (tipo `BigAutoField`, definido em `DEFAULT_AUTO_FIELD`).[cite: 12]

> **Dica:** Sempre que você alterar um model, rode `python manage.py makemigrations` e depois `python manage.py migrate` para o banco acompanhar a mudança.[cite: 12]

### 2.1. RenameImage: nome único para as imagens

Não é uma tabela, e sim uma classe auxiliar usada no parâmetro `upload_to` dos campos de imagem.[cite: 12] Ela recebe a pasta de destino, pega a extensão do arquivo enviado e gera um nome novo com `uuid.uuid4()`.[cite: 12] Assim duas fotos com o mesmo nome original nunca se sobrescrevem, e o nome original do arquivo não fica exposto.[cite: 12]

```text
# Exemplo do resultado
foto enviada: minha foto.jpg
salva como: ftPerfil/3f2b8c1e-9a7d.jpg (dentro de MEDIA_ROOT)
```
*(Exemplo do resultado de renomeação automática de imagens[cite: 12].)*

O decorador `@deconstructible` é necessário para o Django conseguir registrar esse objeto nas migrações.[cite: 12]

### 2.2. Usuario

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| **`fotoPerfil`** | `ImageField`[cite: 12] | Salva em `ftPerfil/` com nome UUID.[cite: 12] Como não tem `blank=True`, é obrigatório.[cite: 12] |
| **`nome`** | `CharField(100)`[cite: 12] | Nome completo.[cite: 12] |
| **`email`** | `EmailField`, `unique`[cite: 12] | Único: o banco rejeita dois cadastros com o mesmo e-mail.[cite: 12] |
| **`senha`** | `CharField(128)`[cite: 12] | Guarda o hash da senha (não o texto puro).[cite: 12] 128 caracteres comportam o hash gerado pelo Django.[cite: 12] |
| **`cpf`** | `CharField(11)`[cite: 12] | Texto, e não número, para preservar zeros à esquerda.[cite: 12] Não há validação de formato.[cite: 12] |
| **`tipo_conta`** | `CharField(20)`, `choices`[cite: 12] | `usuario`, `funcionario` ou `adm`.[cite: 12] Padrão: `usuario`.[cite: 12] Com `editable=False`, não pode ser alterado por formulários.[cite: 12] |

#### Tipos de conta (`TipoConta`)

| Valor salvo | Rótulo | Como é definido / o que o model oferece |
| :--- | :--- | :--- |
| **`usuario`** | Usuário[cite: 13] | Tipo padrão (e-mail sem sufixo especial).[cite: 13] É o único com `pode_emprestar = True`.[cite: 13] |
| **`funcionario`** | Funcionário[cite: 13] | E-mails terminados em `@biblioteca.com`.[cite: 13] Propriedade `is_funcionario`.[cite: 13] |
| **`adm`** | Administrador[cite: 13] | E-mails terminados em `.gov` ou `.gov.br`.[cite: 13] Propriedade `is_adm`.[cite: 13] |

#### Como o tipo de conta é definido

O método estático `tipo_por_email(email)` limpa o e-mail (`strip` e `lower`), percorre o dicionário `TIPO_CONTA_POR_EMAIL` do `settings.py` e verifica se o e-mail termina com algum dos sufixos de cada tipo.[cite: 13] O primeiro tipo que combinar vence; se nenhum combinar, o resultado é `usuario`.[cite: 13]

```python
def save(self, *args, **kwargs):
    self.tipo_conta = self.tipo_por_email(self.email)
    super().save(*args, **kwargs)
```
*(Sobrescrita do método `save()` no model `Usuario`[cite: 13].)*

O `save()` foi sobrescrito para recalcular o tipo a cada gravação.[cite: 13] Por isso o tipo nunca vem do cliente: depende só do e-mail.[cite: 13]

| E-mail | Sufixo que combina | Tipo resultante |
| :--- | :--- | :--- |
| `ana@prefeitura.gov.br`[cite: 13] | `.gov.br`[cite: 13] | `adm`[cite: 13] |
| `joao@biblioteca.com`[cite: 13] | `@biblioteca.com`[cite: 13] | `funcionario`[cite: 13] |
| `maria@gmail.com`[cite: 13] | *(nenhum)*[cite: 13] | `usuario`[cite: 13] |

#### Propriedades auxiliares

`is_adm`, `is_funcionario` e `pode_emprestar` são atalhos que retornam `True` ou `False` conforme o tipo.[cite: 13] Por serem propriedades Python, não são colunas do banco e não podem ser usadas em filtros como `Usuario.objects.filter(is_adm=True)`; nesse caso filtre por `tipo_conta='adm'`.[cite: 13]

> **Atenção:** se você mudar o `TIPO_CONTA_POR_EMAIL` no `settings.py`, usuários já cadastrados só terão o tipo atualizado na próxima vez que forem salvos.[cite: 13]

### 2.3. Categoria

Tabela simples com um único campo, `categoria` (texto de até 100 caracteres), além do `id` automático.[cite: 13] Serve para organizar os livros.[cite: 13]

### 2.4. Livro

| Campo | Tipo | Detalhes |
| :--- | :--- | :--- |
| **`imagem`** | `ImageField`[cite: 14] | Capa do livro, salva em `images/` com nome UUID.[cite: 14] |
| **`titulo`** | `CharField(50)`[cite: 14] | Título.[cite: 14] |
| **`descricao`** | `TextField`[cite: 14] | Texto longo, sem limite de tamanho.[cite: 14] |
| **`dataEntrada`** | `DateField`[cite: 14] | Data em que o livro entrou na biblioteca.[cite: 14] |
| **`categoria`** | `ForeignKey(Categoria)`[cite: 14] | Liga o livro a uma categoria.[cite: 14] |
| **`situacao`** | `CharField(15)`[cite: 14] | Situação atual (texto livre, como `"disponível"`).[cite: 14] |

### 2.5. Emprestimo

Liga um usuário a um livro em um período.[cite: 14] Tem as chaves estrangeiras `livro` e `usuario`, mais as datas `data_emprestimo` e `data_devolucao` (prevista).[cite: 14]

### 2.6. Relacionamentos e o que acontece ao apagar

O parâmetro `on_delete` define o que o Django faz quando o registro referenciado é apagado:[cite: 14]

| Relação | `on_delete` | Efeito |
| :--- | :--- | :--- |
| **Livro > Categoria**[cite: 14] | `DO_NOTHING`[cite: 14] | O Django não faz nada.[cite: 14] Como o MySQL tem a restrição de chave estrangeira, apagar uma categoria que ainda tem livros gera erro de integridade.[cite: 14] |
| **Emprestimo > Livro**[cite: 14] | `CASCADE`[cite: 14] | Apagar um livro apaga também seus empréstimos.[cite: 14] |
| **Emprestimo > Usuario**[cite: 14] | `CASCADE`[cite: 14] | Apagar um usuário apaga também seus empréstimos.[cite: 14] |

Em resumo: uma `Categoria` tem vários `Livros`; um `Livro` e um `Usuario` se relacionam por meio de vários `Emprestimos` (a tabela de empréstimos é a ponte entre eles).[cite: 14]

---

## 3. Serializers (conversão e validação dos dados)

A API conversa em JSON, mas o banco guarda objetos Python (models).[cite: 15] O serializer faz a tradução nos dois sentidos e ainda valida os dados que chegam antes de gravar.[cite: 15] O projeto usa `ModelSerializer`, que monta os campos automaticamente a partir do model.[cite: 15]

Em todos os serializers aparece a mesma estrutura:[cite: 15]

```python
class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Livro
        fields = '__all__'
        extra_kwargs = {...}
```
*(Estrutura padrão dos serializers do projeto[cite: 15].)*

| Elemento | Função |
| :--- | :--- |
| **`model`** | Diz de qual model os campos serão gerados.[cite: 15] |
| **`fields = '__all__'`** | Expõe todos os campos do model na API.[cite: 15] |
| **`extra_kwargs`** | Ajusta opções por campo.[cite: 15] Aqui é usado para o `help_text`, a descrição que aparece na documentação Swagger e Redoc.[cite: 15] |

### 3.1. Os quatro serializers principais

| Serializer | Model | Particularidades |
| :--- | :--- | :--- |
| **`CategoriaSerializer`** | `Categoria`[cite: 15] | Apenas `help_text` para `id` e `categoria`.[cite: 15] |
| **`LivroSerializer`** | `Livro`[cite: 15] | O `help_text` de `categoria` orienta a buscar o ID no `GET` da API de Categoria.[cite: 15] |
| **`EmprestimoSerializer`** | `Emprestimo`[cite: 15] | O `help_text` de `livro` e `usuario` orienta de onde pegar os IDs.[cite: 15] |
| **`UsuarioSerializer`** | `Usuario`[cite: 15] | Tem regras especiais de segurança (seção 3.2).[cite: 15] |

Como as relações são chaves estrangeiras, na API elas são informadas pelo ID do registro relacionado.[cite: 15] Por isso os textos de ajuda mandam consultar o `GET` da outra API antes.[cite: 15]

### 3.2. UsuarioSerializer: as regras de segurança

| Configuração | Efeito |
| :--- | :--- |
| **`read_only_fields = ['tipo_conta']`** | O cliente não consegue enviar nem alterar o tipo de conta pela API.[cite: 15] Ele é calculado pelo e-mail no model.[cite: 15] |
| **`'senha': {'write_only': True}`** | A senha pode ser enviada, mas nunca é devolvida nas respostas da API.[cite: 15] |
| **`validate_senha(self, valor)`** | O DRF chama métodos `validate_<campo>` automaticamente.[cite: 15] Este troca a senha enviada pelo hash gerado por `make_password`, que é o que será gravado no banco.[cite: 15] |

```python
def validate_senha(self, valor):
    return make_password(valor)
```
*(Validação e encriptação da senha no `UsuarioSerializer`[cite: 16].)*

**Resultado:** o banco nunca guarda a senha em texto puro.[cite: 16] Para conferir a senha no login, o código precisa usar `check_password` (do Django), que compara a senha digitada com o hash.[cite: 16]

### 3.3. UsuarioEmprestimosSerializer

Serializer pensado para mostrar os empréstimos de um usuário, com dois campos de texto declarados manualmente: `nome` e `LivroEmp`.[cite: 16] Ele não tem classe `Meta`, ou seja, não está ligado a nenhum model; os dados precisam ser montados pela view.[cite: 16] Veja a observação sobre ele na seção 7.[cite: 16]

---

## 4. Settings (configurações do projeto)

O `settings.py` é lido pelo Django ao iniciar.[cite: 17] Cada bloco configura uma parte do sistema:[cite: 17]

| Configuração | O que faz |
| :--- | :--- |
| **`BASE_DIR`** | Pasta raiz do projeto, calculada a partir do próprio arquivo.[cite: 17] Serve de base para outros caminhos.[cite: 17] |
| **`SECRET_KEY`** | Chave usada em operações criptográficas (sessões, tokens).[cite: 17] Deve ser secreta.[cite: 17] *(Valor omitido neste guia.)*[cite: 17] |
| **`DEBUG = True`** | Modo de desenvolvimento: mostra páginas de erro detalhadas e serve arquivos de mídia.[cite: 17] |
| **`ALLOWED_HOSTS = []`** | Lista de domínios permitidos.[cite: 17] Vazia funciona em desenvolvimento local; em produção deve listar os domínios.[cite: 17] |
| **`INSTALLED_APPS`** | Apps ativos: os do Django (`admin`, `auth`, `sessions`...), mais `rest_framework` (API), `drf_yasg` (Swagger/Redoc), `bookstore` (seu app) e `corsheaders` (CORS).[cite: 17] |
| **`TIPO_CONTA_POR_EMAIL`** | Configuração própria do projeto: dicionário com os sufixos de e-mail de cada tipo de conta (seção 4.1).[cite: 17] |
| **`MIDDLEWARE`** | Camadas que processam toda requisição: segurança, sessão, CSRF, autenticação, mensagens, clickjacking e CORS.[cite: 17] |
| **`ROOT_URLCONF`** | Aponta o arquivo de rotas principal: `setup.urls`.[cite: 17] |
| **`TEMPLATES`** | Configura os templates HTML do Django (usados, por exemplo, pelo painel admin).[cite: 17] |
| **`WSGI_APPLICATION`** | Ponto de entrada para servidores web em produção.[cite: 17] |
| **`DATABASES`** | Conexão com o MySQL (seção 4.2).[cite: 17] |
| **`AUTH_PASSWORD_VALIDATORS`** | Regras de senha do sistema de usuários do Django (similaridade, tamanho mínimo, senhas comuns, só números).[cite: 17] |
| **`LANGUAGE_CODE` / `TIME_ZONE`** | Idioma `pt-br` e fuso `America/Sao_Paulo`.[cite: 17] `USE_TZ = True` guarda datas com fuso horário.[cite: 17] |
| **`STATIC_URL` / `STATICFILES_DIRS`** | Arquivos estáticos (como os scripts JS do front) servidos em `/static/`, buscados em `bookstore/static/scripts`.[cite: 17] |
| **`DEFAULT_AUTO_FIELD`** | Tipo do `id` criado automaticamente nos models (`BigAutoField`).[cite: 17] |
| **`CORS_ALLOW_ALL_ORIGINS = True`** | Permite que páginas de qualquer origem chamem a API (necessário quando o front roda em endereço/porta diferentes).[cite: 17] |
| **`MEDIA_URL` / `MEDIA_ROOT`** | Arquivos enviados pelos usuários (fotos e capas): acessados em `/media/` e gravados na pasta `media/` do projeto.[cite: 17] |

### 4.1. TIPO_CONTA_POR_EMAIL

```python
TIPO_CONTA_POR_EMAIL = {
    "adm": [".gov", ".gov.br"],
    "funcionario": ["@biblioteca.com"],
}
```
*(Dicionário de mapeamento de sufixos de e-mail em `settings.py`[cite: 18].)*

Cada chave é um tipo de conta e cada valor é uma lista de sufixos.[cite: 18] O model compara o final do e-mail com esses sufixos.[cite: 18] Note que `.gov.br` precisa estar na lista separadamente, pois um e-mail terminado em `.gov.br` não termina em `.gov`.[cite: 18] Para incluir um novo tipo de e-mail, basta adicionar um sufixo à lista correspondente, sem mexer no model.[cite: 18]

### 4.2. DATABASES (MySQL)

| Chave | Valor | Significado |
| :--- | :--- | :--- |
| **`ENGINE`** | `django.db.backends.mysql`[cite: 18] | Usa o MySQL (por meio do `mysqlclient`).[cite: 18] |
| **`NAME`** | `bookstore`[cite: 18] | Nome do banco.[cite: 18] |
| **`USER`** | `root`[cite: 18] | Usuário de conexão.[cite: 18] |
| **`PASSWORD`** | *(omitida neste guia)*[cite: 18] | Senha do usuário no MySQL.[cite: 18] |
| **`HOST`** | `localhost`[cite: 18] | Servidor do MySQL (a própria máquina).[cite: 18] |
| **`PORT`** | `3306`[cite: 18] | Porta padrão do MySQL.[cite: 18] |
| **`OPTIONS: charset`** | `utf8mb4`[cite: 18] | Aceita acentos, caracteres especiais e emojis.[cite: 18] |

### 4.3. Arquivos estáticos e de mídia: qual a diferença?

| Aspecto | Estáticos | Mídia |
| :--- | :--- | :--- |
| **O que são** | Arquivos do próprio sistema (JS, CSS, imagens do layout).[cite: 18] | Arquivos enviados pelos usuários (fotos de perfil, capas de livros).[cite: 18] |
| **URL** | `/static/`[cite: 18] | `/media/`[cite: 18] |
| **Pasta** | `bookstore/static/scripts`[cite: 18] | `media/` (`MEDIA_ROOT`)[cite: 18] |
| **Quem alimenta** | Você, ao programar.[cite: 18] | Os usuários, pela API (campos `ImageField`).[cite: 18] |

---

## 5. URLs (rotas da aplicação)

O arquivo de URLs diz ao Django qual código responde a cada endereço.[cite: 19] Ele tem quatro partes:[cite: 19]

### 5.1. Documentação da API (`schema_view`)

A função `get_schema_view`, do `drf-yasg`, descreve a API (título `"Bookstore API"`, versão `v1`, licença e contato) e gera os documentos Swagger e Redoc.[cite: 19] Com `public=True` e `AllowAny`, qualquer pessoa pode abrir a documentação.[cite: 19]

### 5.2. O roteador (`DefaultRouter`)

Em vez de escrever uma rota por operação, o projeto registra cada ViewSet no roteador e ele cria as rotas sozinho:[cite: 19]

```python
route = routers.DefaultRouter()
route.register(r'Livros', viewsets.LivroViewSet, basename='Livros')
```
*(Registro de ViewSet no roteador do Django REST Framework[cite: 19].)*

Para cada registro, o roteador cria uma rota de coleção e uma de item.[cite: 19] Supondo que os ViewSets sejam `ModelViewSet` (completos), o resultado é:[cite: 19]

| Endereço | Método | Ação |
| :--- | :--- | :--- |
| `/Livros/`[cite: 19] | `GET`[cite: 19] | Lista todos os livros.[cite: 19] |
| `/Livros/`[cite: 19] | `POST`[cite: 19] | Cadastra um livro.[cite: 19] |
| `/Livros/<id>/`[cite: 19] | `GET`[cite: 19] | Mostra um livro.[cite: 19] |
| `/Livros/<id>/`[cite: 19] | `PUT`/`PATCH`[cite: 19] | Altera um livro (completo / parcial).[cite: 19] |
| `/Livros/<id>/`[cite: 19] | `DELETE`[cite: 19] | Apaga um livro.[cite: 19] |

O mesmo vale para os outros três registros:[cite: 19]

| Prefixo | ViewSet | Dados |
| :--- | :--- | :--- |
| `/Usuarios/`[cite: 19] | `UsuarioViewSet`[cite: 19] | Usuários e contas.[cite: 19] |
| `/Livros/`[cite: 19] | `LivroViewSet`[cite: 19] | Livros.[cite: 19] |
| `/Emprestimos/`[cite: 19] | `EmprestimoViewSet`[cite: 19] | Empréstimos.[cite: 19] |
| `/Categorias/`[cite: 19] | `CategoriaViewSet`[cite: 19] | Categorias.[cite: 19] |

O `DefaultRouter` também cria a página inicial da API em `/`, com a lista dos endereços registrados.[cite: 19]

### 5.3. Rotas fixas

| Endereço | O que abre |
| :--- | :--- |
| `/admin/`[cite: 20] | Painel administrativo do Django.[cite: 20] |
| `/swagger/`[cite: 20] | Documentação interativa (Swagger): permite testar a API pelo navegador.[cite: 20] |
| `/redoc/`[cite: 20] | Documentação em formato Redoc (leitura).[cite: 20] |
| `/aswaggerjson/`[cite: 20] | Arquivo JSON do esquema da API.[cite: 20] |
| `/Login/`[cite: 20] | Rota de login, tratada pela função `viewsets.login`.[cite: 20] |
| `/media/...`[cite: 20] | Imagens enviadas (só funciona com `DEBUG = True`).[cite: 20] |

As rotas de mídia usam `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` dentro de um `if settings.DEBUG`.[cite: 20] Isso é um recurso do servidor de desenvolvimento; em produção, o servidor web precisa servir a pasta `media` por conta própria.[cite: 20]

---

## 6. Exemplo completo: o cadastro de um usuário

Veja como as quatro partes trabalham juntas quando o front envia um cadastro (supondo que o `UsuarioViewSet` use o `UsuarioSerializer`):[cite: 21]

1. O front faz um `POST` para `http://127.0.0.1:8000/Usuarios/` com nome, e-mail, senha, cpf e a foto (como formulário com arquivo, por causa da imagem).[cite: 21]
2. O CORS (`settings`) permite que a requisição venha de outra origem.[cite: 21]
3. O `urls.py` encontra o prefixo `Usuarios` e entrega a requisição ao `UsuarioViewSet`.[cite: 21]
4. O `UsuarioSerializer` valida os campos (e-mail único, tamanhos máximos, foto obrigatória) e ignora qualquer `tipo_conta` enviado, pois é somente leitura.[cite: 21]
5. O `validate_senha` troca a senha pelo hash.[cite: 21]
6. Ao gravar, o `Usuario.save()` consulta o `TIPO_CONTA_POR_EMAIL` e define o tipo de conta pelo e-mail.[cite: 21]
7. O `RenameImage` dá um nome UUID à foto, que vai para a pasta `media/ftPerfil/` (`MEDIA_ROOT`).[cite: 21]
8. O registro é gravado no MySQL (banco `bookstore`, tabela do app `bookstore`).[cite: 21]
9. A resposta volta em JSON, sem a senha (`write_only`), já com o `tipo_conta` calculado.[cite: 21]

---

## 7. Pontos de atenção e melhorias sugeridas

> Este projeto foi desenvolvido por um estudante universitário e, como parte de seu processo de desenvolvimento, pode apresentar erros, vulnerabilidades de segurança.[cite: 22]
>
> Com o objetivo de identificar possíveis problemas, solicitei ao Claude AI versão Sonnet 5.5 uma análise do código, que apontou falhas, possíveis vulnerabilidades e sugestões de melhorias.[cite: 22]
>
> Portanto, reforço que este projeto deve ser utilizado com cautela.[cite: 22] Antes de aplicá-lo em qualquer ambiente real, recomendo que todo o código seja devidamente revisado, testado e, se necessário, corrigido por profissionais qualificados.[cite: 22]
>
> O projeto é disponibilizado como uma iniciativa de aprendizado e desenvolvimento, não como uma solução pronta para uso em ambientes que exijam garantias de segurança e confiabilidade.[cite: 22]

A lista abaixo não aponta erros de funcionamento: são cuidados e melhorias que valem a pena, em ordem aproximada de importância.[cite: 22] Vários são aceitáveis em desenvolvimento, mas importam quando o projeto for usado de verdade.[cite: 22]

| Item | Situação atual | Sugestão |
| :--- | :--- | :--- |
| **Senha do banco e `SECRET_KEY` no código**[cite: 22] | Estão escritas diretamente no `settings.py`.[cite: 22] Se o arquivo foi para o GitHub, qualquer pessoa com acesso ao repositório as vê.[cite: 22] | Mover para variáveis de ambiente ou um arquivo `.env` fora do Git.[cite: 22] Se já foram publicadas, trocar a senha do MySQL e gerar uma nova `SECRET_KEY`.[cite: 22] |
| **Tipo de conta só pelo e-mail**[cite: 22] | Qualquer pessoa pode se cadastrar com um e-mail terminado em `.gov` e virar administrador, pois o e-mail não é verificado.[cite: 22] | Confirmar o e-mail (link de verificação) antes de conceder adm/funcionário, ou conceder esses tipos manualmente.[cite: 22] |
| **API sem autenticação**[cite: 22] | Não há bloco `REST_FRAMEWORK` no settings, então valem os padrões do DRF: sem exigir login.[cite: 22] O Swagger também é público.[cite: 22] | Definir autenticação e permissões (por exemplo, só adm cria livros e categorias).[cite: 22] |
| **CORS liberado para todos**[cite: 22] | `CORS_ALLOW_ALL_ORIGINS = True` permite que qualquer site chame a API.[cite: 22] | Em produção, usar `CORS_ALLOWED_ORIGINS` com a lista dos endereços do front.[cite: 22] |
| **`DEBUG` e `ALLOWED_HOSTS`**[cite: 22] | `DEBUG = True` (aparece duas vezes no arquivo) e `ALLOWED_HOSTS` vazio.[cite: 22] | Em produção: `DEBUG = False` e `ALLOWED_HOSTS` com os domínios.[cite: 22] Remover a repetição.[cite: 22] |
| **Posição do `CorsMiddleware`**[cite: 22] | Está por último na lista `MIDDLEWARE`.[cite: 22] | A documentação do `django-cors-headers` recomenda colocá-lo o mais acima possível, antes do `CommonMiddleware`.[cite: 22] |
| **Caminho dos estáticos**[cite: 22] | `'bookstore\static\scripts'` usa barra invertida em string comum.[cite: 22] No Python 3.12+ o `\s` gera aviso de sequência inválida.[cite: 22] | Usar `BASE_DIR / 'bookstore' / 'static' / 'scripts'` (funciona em qualquer sistema).[cite: 22] |
| **`Livro.categoria` com `DO_NOTHING`**[cite: 23] | Apagar uma categoria com livros causa erro de integridade no MySQL.[cite: 23] | Usar `PROTECT` (erro claro e controlado) ou decidir o que acontece com os livros.[cite: 23] |
| **`UsuarioEmprestimosSerializer`**[cite: 23] | Herda de `ModelSerializer` mas não tem `Meta`.[cite: 23] O DRF costuma exigir `Meta` em um `ModelSerializer` e pode dar erro ao usá-lo.[cite: 23] | Se não estiver ligado a um model, herdar de `serializers.Serializer`.[cite: 23] Vale testar o endpoint que o usa.[cite: 23] |
| **`Livro.situacao` em texto livre**[cite: 23] | Aceita qualquer texto, o que permite variações como `"Disponivel"` e `"disponível"`.[cite: 23] | Usar `TextChoices`, como já foi feito em `Usuario.TipoConta`.[cite: 23] |
| **CPF sem validação**[cite: 23] | Aceita qualquer texto de até 11 caracteres e pode se repetir.[cite: 23] | Validar 11 dígitos (e o dígito verificador) e avaliar `unique=True`.[cite: 23] |
| **Detalhes de acabamento**[cite: 23] | A rota `"aswaggerjson/"` parece ter uma letra `a` a mais; a descrição da API tem `"ssaida"`; o e-mail de contato é fictício; o import de `views` no `urls.py` parece não ser usado.[cite: 23] | Corrigir o texto e remover o que não é usado.[cite: 23] |

### Exemplo de leitura de variáveis de ambiente

Exemplo de como ler configurações sensíveis de variáveis de ambiente (apenas o trecho a adicionar ao `settings.py`):[cite: 24]

```python
import os

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
# em DATABASES: 'PASSWORD': os.environ["DB_PASSWORD"],
```
*(Trecho de configuração via variáveis de ambiente no `settings.py`[cite: 24].)*

> **Dica:** Em desenvolvimento local, você pode definir a variável no PowerShell antes de rodar o servidor: `$env:DB_PASSWORD = "sua-senha"`.[cite: 24] Ela vale só para aquela janela do terminal.[cite: 24]
