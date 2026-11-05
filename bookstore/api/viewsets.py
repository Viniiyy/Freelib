from rest_framework import viewsets
from rest_framework.decorators import action
from bookstore.api import serializers
from bookstore import models
from drf_yasg.utils import swagger_auto_schema
from django.db.models import Sum
from rest_framework.response import Response
from bookstore.models import Usuario
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password



# ViewSet responsável pelas operações relacionadas aos usuários.
class UsuarioViewSet(viewsets.ModelViewSet):

    # Define o serializador utilizado para converter os dados dos usuários.
    serializer_class = serializers.UsuarioSerializer

    # Define a consulta que retorna todos os usuários cadastrados.
    queryset = models.Usuario.objects.all()

    # Documenta a operação de listagem de usuários na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Lista todos os usuários",
        responses={200: serializers.UsuarioSerializer(many=True)}
    )
    # Retorna a lista de usuários cadastrados.
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # Documenta a operação de criação de usuários na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Cria um novo usuário",
        responses={201: "Usuário criado com sucesso"}
    )
    # Cadastra um novo usuário utilizando os dados enviados na requisição.
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # Documenta a operação de consulta de um usuário específico.
    @swagger_auto_schema(
        operation_description="Retorna o usuário conforme o ID",
        responses={200: serializers.UsuarioSerializer()}
    )
    # Retorna os dados de um usuário conforme seu identificador.
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Documenta a operação de atualização de usuários.
    @swagger_auto_schema(
        operation_description="Altera o usuário conforme ID e dados informados",
        responses={200: "Usuário alterado com sucesso"}
    )
    # Atualiza os dados de um usuário conforme seu identificador.
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # Documenta a operação de exclusão de usuários.
    @swagger_auto_schema(
        operation_description="Deleta o usuário",
        responses={204: "Usuário deletado com sucesso"}
    )
    # Exclui um usuário conforme seu identificador.
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    # Cria uma rota adicional para consultar os empréstimos de um usuário.
    @swagger_auto_schema(
        operation_description="Retorna os empréstimos do usuário",
        responses={200: serializers.EmprestimoSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])

    # Busca e retorna todos os empréstimos associados ao usuário informado.
    def emprestimos(self, request, pk=None):
        usuario = self.get_object()
        emprestimos = models.Emprestimo.objects.filter(usuario=usuario)
        serializer = serializers.EmprestimoSerializer(emprestimos, many=True)
        return Response(serializer.data)


# ViewSet responsável pelas operações relacionadas aos livros.
class LivroViewSet(viewsets.ModelViewSet):

    # Define o serializador utilizado para converter os dados dos livros.
    serializer_class = serializers.LivroSerializer

    # Define a consulta que retorna todos os livros cadastrados.
    queryset = models.Livro.objects.all()

    # Documenta a operação de listagem de livros na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Lista todos os livros",
        responses={200: serializers.LivroSerializer(many=True)}
    )
    # Retorna a lista de livros cadastrados.
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # Documenta a operação de criação de livros na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Cria um novo livro",
        responses={201: "Livro criado com sucesso"}
    )
    # Cadastra um novo livro utilizando os dados enviados na requisição.
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # Documenta a operação de consulta de um livro específico.
    @swagger_auto_schema(
        operation_description="Retorna o livro conforme o ID",
        responses={200: serializers.LivroSerializer()}
    )
    # Retorna os dados de um livro conforme seu identificador.
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Documenta a operação de atualização de livros.
    @swagger_auto_schema(
        operation_description="Altera o livro conforme ID e dados informados",
        responses={200: "Livro alterado com sucesso"}
    )
    # Atualiza os dados de um livro conforme seu identificador.
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # Documenta a operação de exclusão de livros.
    @swagger_auto_schema(
        operation_description="Deleta o livro",
        responses={204: "Livro deletado com sucesso"}
    )
    # Exclui um livro conforme seu identificador.
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# ViewSet responsável pelas operações relacionadas aos empréstimos.
class EmprestimoViewSet(viewsets.ModelViewSet):

    # Define o serializador utilizado para converter os dados dos empréstimos.
    serializer_class = serializers.EmprestimoSerializer

    # Define a consulta que retorna todos os empréstimos cadastrados.
    queryset = models.Emprestimo.objects.all()

    # Documenta a operação de listagem de empréstimos na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Lista todos os empréstimos",
        responses={200: serializers.EmprestimoSerializer(many=True)}
    )
    # Retorna a lista de empréstimos cadastrados.
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # Documenta a operação de criação de empréstimos na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Cria um novo empréstimo",
        responses={201: "Empréstimo criado com sucesso"}
    )
    # Cadastra um novo empréstimo utilizando os dados enviados na requisição.
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # Documenta a operação de consulta de um empréstimo específico.
    @swagger_auto_schema(
        operation_description="Retorna o empréstimo conforme o ID",
        responses={200: serializers.EmprestimoSerializer()}
    )
    # Retorna os dados de um empréstimo conforme seu identificador.
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Documenta a operação de atualização de empréstimos.
    @swagger_auto_schema(
        operation_description="Altera o empréstimo conforme ID e dados informados",
        responses={200: "Empréstimo alterado com sucesso"}
    )
    # Atualiza os dados de um empréstimo conforme seu identificador.
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # Documenta a operação de exclusão de empréstimos.
    @swagger_auto_schema(
        operation_description="Deleta o empréstimo",
        responses={204: "Empréstimo deletado com sucesso"}
    )
    # Exclui um empréstimo conforme seu identificador.
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# ViewSet responsável pelas operações relacionadas às categorias.
class CategoriaViewSet(viewsets.ModelViewSet):

    # Define o serializador utilizado para converter os dados das categorias.
    serializer_class = serializers.CategoriaSerializer

    # Define a consulta que retorna todas as categorias cadastradas.
    queryset = models.Categoria.objects.all()

    # Documenta a operação de listagem de categorias na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Lista todas as categorias",
        responses={200: serializers.CategoriaSerializer(many=True)}
    )
    # Retorna a lista de categorias cadastradas.
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # Documenta a operação de criação de categorias na documentação Swagger.
    @swagger_auto_schema(
        operation_description="Cria uma nova categoria",
        responses={201: "Categoria criada com sucesso"}
    )
    # Cadastra uma nova categoria utilizando os dados enviados na requisição.
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # Documenta a operação de consulta de uma categoria específica.
    @swagger_auto_schema(
        operation_description="Retorna a categoria conforme o ID",
        responses={200: serializers.CategoriaSerializer()}
    )
    # Retorna os dados de uma categoria conforme seu identificador.
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # Documenta a operação de atualização de categorias.
    @swagger_auto_schema(
        operation_description="Altera a categoria conforme ID e dados informados",
        responses={200: "Categoria alterada com sucesso"}
    )
    # Atualiza os dados de uma categoria conforme seu identificador.
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # Documenta a operação de exclusão de categorias.
    @swagger_auto_schema(
        operation_description="Deleta a categoria",
        responses={204: "Categoria deletada com sucesso"}
    )
    # Exclui uma categoria conforme seu identificador.
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# Define uma rota da API que aceita requisições do tipo POST para realizar o login.
@api_view(['POST'])
def login(request):

    # Recupera o e-mail enviado na requisição e remove espaços desnecessários.
    email = request.data.get('email', '').strip()

    # Recupera a senha enviada na requisição.
    senha = request.data.get('senha', '')

    # Busca o usuário pelo e-mail, ignorando diferenças entre letras maiúsculas e minúsculas.
    usuario = Usuario.objects.filter(email__iexact=email).first()

    # Verifica se o usuário existe e se a senha informada corresponde à senha armazenada.
    if usuario is None or not check_password(senha, usuario.senha):
        return Response({'erro': 'E-mail ou senha inválidos.'}, status=401)

    # Retorna os dados básicos do usuário após a autenticação bem-sucedida.
    return Response({
        'id': usuario.id,
        'nome': usuario.nome,
        'tipo_conta': usuario.tipo_conta,
    })