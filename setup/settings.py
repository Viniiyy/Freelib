"""
Configurações gerais do projeto Django.

Define as aplicações instaladas, configurações de segurança,
banco de dados, arquivos estáticos, arquivos de mídia,
idioma, fuso horário e permissões de acesso.
"""

# Importa a ferramenta utilizada para trabalhar com caminhos de arquivos e diretórios.
from pathlib import Path

# Define o diretório principal do projeto.
BASE_DIR = Path(__file__).resolve().parent.parent


# Chave utilizada pelo Django para operações criptográficas e de segurança.
SECRET_KEY = 'django-insecure-22vadj$dbfxd(lny@n4_p4umr6@p6+z1bav9hma+obfa*a=m*%'

# Ativa o modo de desenvolvimento, disponibilizando recursos de depuração.
DEBUG = True

# Define os domínios autorizados a acessar a aplicação.
ALLOWED_HOSTS = []


# Aplicações e bibliotecas utilizadas pelo projeto.
INSTALLED_APPS = [
    'django.contrib.admin',          # Painel administrativo do Django.
    'django.contrib.auth',           # Sistema de autenticação e permissões.
    'django.contrib.contenttypes',   # Gerenciamento dos tipos de conteúdo.
    'django.contrib.sessions',       # Gerenciamento de sessões dos usuários.
    'django.contrib.messages',       # Sistema de mensagens temporárias.
    'django.contrib.staticfiles',    # Gerenciamento de arquivos estáticos.
    'rest_framework',                # Framework para desenvolvimento de APIs REST.
    'drf_yasg',                      # Geração da documentação Swagger e Redoc.
    'bookstore',                     # Aplicativo principal da biblioteca.
    'corsheaders'                    # Gerenciamento de permissões de acesso entre origens.
]


# Define os tipos de conta conforme os sufixos dos e-mails cadastrados.
TIPO_CONTA_POR_EMAIL = {
    "adm": [".gov", ".gov.br"],
    "funcionario": ["@biblioteca.com"],
}


# Define os componentes responsáveis pelo processamento das requisições.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',          # Aplica recursos de segurança.
    'django.contrib.sessions.middleware.SessionMiddleware',   # Gerencia as sessões.
    'django.middleware.common.CommonMiddleware',              # Aplica funcionalidades comuns às requisições.
    'django.middleware.csrf.CsrfViewMiddleware',               # Protege contra ataques CSRF.
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Gerencia a autenticação.
    'django.contrib.messages.middleware.MessageMiddleware',   # Gerencia mensagens temporárias.
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Protege contra clickjacking.
    'corsheaders.middleware.CorsMiddleware',                  # Gerencia as requisições CORS.
]


# Define o arquivo responsável pelo roteamento principal do projeto.
ROOT_URLCONF = 'setup.urls'


# Configura o sistema de renderização de templates HTML.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],                  # Diretórios adicionais para busca de templates.
        'APP_DIRS': True,            # Permite buscar templates dentro dos aplicativos.
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',       # Disponibiliza informações de depuração.
                'django.template.context_processors.request',     # Disponibiliza os dados da requisição.
                'django.contrib.auth.context_processors.auth',     # Disponibiliza informações de autenticação.
                'django.contrib.messages.context_processors.messages', # Disponibiliza mensagens temporárias.
            ],
        },
    },
]


# Define a aplicação WSGI utilizada para executar o projeto em servidores compatíveis.
WSGI_APPLICATION = 'setup.wsgi.application'


# Configura a conexão com o banco de dados MySQL.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Define o MySQL como sistema gerenciador do banco de dados.
        'NAME': 'bookstore',                   # Nome do banco de dados.
        'USER': 'root',                        # Usuário utilizado na conexão.
        'PASSWORD': 'NSFreeLib123',             # Senha do usuário do banco de dados.
        'HOST': 'localhost',                   # Endereço do servidor MySQL.
        'PORT': '3306',                        # Porta padrão do MySQL.
        'OPTIONS': {
            'charset': 'utf8mb4',              # Permite armazenar caracteres especiais e emojis.
        }
    }
}


# Define os validadores utilizados para verificar a segurança das senhas.
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },  # Verifica se a senha é muito semelhante aos dados do usuário.
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },  # Verifica o comprimento mínimo da senha.
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },  # Impede a utilização de senhas muito comuns.
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },  # Impede senhas compostas somente por números.
]


# Configurações de idioma e localização do projeto.
LANGUAGE_CODE = 'pt-br'  # Define o português brasileiro como idioma padrão.

TIME_ZONE = 'America/Sao_Paulo'  # Define o fuso horário de Brasília.

USE_I18N = True  # Ativa os recursos de internacionalização.

USE_TZ = True  # Ativa o suporte a datas e horários com fuso horário.


# Configurações relacionadas aos arquivos estáticos.
STATIC_URL = '/static/'  # Define a URL utilizada para acessar arquivos estáticos.

import os

# Define os diretórios adicionais onde o Django procura arquivos estáticos.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'bookstore\static\scripts')
]


# Define o tipo padrão de chave primária utilizado nos modelos.
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Permite requisições de qualquer origem por meio do CORS.
CORS_ALLOW_ALL_ORIGINS = True


# Mantém o modo de depuração ativado.
DEBUG = True


# Configura o armazenamento e o acesso aos arquivos enviados pelos usuários.
MEDIA_URL = '/media/'  # Define a URL utilizada para acessar arquivos de mídia.

MEDIA_ROOT = BASE_DIR / 'media'  # Define o diretório onde os arquivos de mídia são armazenados.