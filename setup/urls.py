"""
Configuração das URLs do projeto setup.

Define as rotas de acesso ao painel administrativo, à API,
à documentação Swagger e Redoc, e ao sistema de login.
"""

# Importa o painel administrativo do Django.
from django.contrib import admin

# Importa as funções utilizadas para definir e incluir rotas.
from django.urls import path, include

# Importa os ViewSets responsáveis pelas operações da API.
from bookstore.api import viewsets

# Importa ferramentas para configurar o roteamento e as permissões da API.
from rest_framework import routers, permissions

# Importa os recursos necessários para configurar a documentação da API.
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

# Importa as views do aplicativo bookstore.
from bookstore import views

# Importa as configurações do projeto e o recurso para servir arquivos estáticos e de mídia.
from django.conf import settings
from django.conf.urls.static import static


# Configura as informações e permissões da documentação da API.
schema_view = get_schema_view(
    openapi.Info(
        title="Bookstore API",  # Define o título da documentação.
        default_version='v1',  # Define a versão da API.
        description="API para documentar entrada e ssaida de livros",  # Descreve a finalidade da API.
        terms_of_service="https://www.google.com/policies/terms/",  # Define os termos de serviço.
        contact=openapi.Contact(email="mRf0M@example.com"),  # Define o e-mail de contato.
        license=openapi.License(name="Free"),  # Define a licença da API.
    ),
    public=True,

    # Permite que qualquer usuário visualize a documentação da API.
    permission_classes=(permissions.AllowAny,),
)


# Inicializa o roteador responsável por registrar as rotas dos ViewSets.
route = routers.DefaultRouter()

# Registra as rotas relacionadas aos usuários.
route.register(r'Usuarios', viewsets.UsuarioViewSet, basename='Usuarios')

# Registra as rotas relacionadas aos livros.
route.register(r'Livros', viewsets.LivroViewSet, basename='Livros')

# Registra as rotas relacionadas aos empréstimos.
route.register(r'Emprestimos', viewsets.EmprestimoViewSet, basename='Emprestimos')

# Registra as rotas relacionadas às categorias.
route.register(r'Categorias', viewsets.CategoriaViewSet, basename='Categorias')


# Define as principais URLs disponíveis no projeto.
urlpatterns = [
    # Disponibiliza o painel administrativo do Django.
    path('admin/', admin.site.urls),

    # Inclui automaticamente as rotas registradas no roteador da API.
    path('', include(route.urls)),
]


# Adiciona as rotas relacionadas à documentação e autenticação da API.
urlpatterns += [

    # Disponibiliza o arquivo JSON com o esquema da documentação.
    path('aswaggerjson/', schema_view.without_ui(cache_timeout=0), name='schema-json'),

    # Disponibiliza a documentação interativa utilizando Swagger.
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

    # Disponibiliza a documentação da API utilizando Redoc.
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Define a rota utilizada para realizar o login dos usuários.
    path('Login/', viewsets.login, name='login'),
]


# Verifica se o projeto está em modo de desenvolvimento.
if settings.DEBUG:

    # Permite acessar os arquivos de mídia, como imagens de perfil e capas de livros.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)