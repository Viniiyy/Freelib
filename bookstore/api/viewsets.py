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



class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UsuarioSerializer
    queryset = models.Usuario.objects.all()

    @swagger_auto_schema(
        operation_description="Lista todos os usuários",
        responses={200: serializers.UsuarioSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Cria um novo usuário",
        responses={201: "Usuário criado com sucesso"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna o usuário conforme o ID",
        responses={200: serializers.UsuarioSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Altera o usuário conforme ID e dados informados",
        responses={200: "Usuário alterado com sucesso"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Deleta o usuário",
        responses={204: "Usuário deletado com sucesso"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna os empréstimos do usuário",
        responses={200: serializers.EmprestimoSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def emprestimos(self, request, pk=None):
        usuario = self.get_object()
        emprestimos = models.Emprestimo.objects.filter(usuario=usuario)
        serializer = serializers.EmprestimoSerializer(emprestimos, many=True)
        return Response(serializer.data)


class LivroViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LivroSerializer
    queryset = models.Livro.objects.all()

    @swagger_auto_schema(
        operation_description="Lista todos os livros",
        responses={200: serializers.LivroSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Cria um novo livro",
        responses={201: "Livro criado com sucesso"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna o livro conforme o ID",
        responses={200: serializers.LivroSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Altera o livro conforme ID e dados informados",
        responses={200: "Livro alterado com sucesso"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Deleta o livro",
        responses={204: "Livro deletado com sucesso"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class EmprestimoViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EmprestimoSerializer
    queryset = models.Emprestimo.objects.all()

    @swagger_auto_schema(
        operation_description="Lista todos os empréstimos",
        responses={200: serializers.EmprestimoSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Cria um novo empréstimo",
        responses={201: "Empréstimo criado com sucesso"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna o empréstimo conforme o ID",
        responses={200: serializers.EmprestimoSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Altera o empréstimo conforme ID e dados informados",
        responses={200: "Empréstimo alterado com sucesso"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Deleta o empréstimo",
        responses={204: "Empréstimo deletado com sucesso"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class CategoriaViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CategoriaSerializer
    queryset = models.Categoria.objects.all()

    @swagger_auto_schema(
        operation_description="Lista todas as categorias",
        responses={200: serializers.CategoriaSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Cria uma nova categoria",
        responses={201: "Categoria criada com sucesso"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna a categoria conforme o ID",
        responses={200: serializers.CategoriaSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Altera a categoria conforme ID e dados informados",
        responses={200: "Categoria alterada com sucesso"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Deleta a categoria",
        responses={204: "Categoria deletada com sucesso"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

@api_view(['POST'])
def login(request):
    email = request.data.get('email', '').strip()
    senha = request.data.get('senha', '')

    usuario = Usuario.objects.filter(email__iexact=email).first()

    if usuario is None or not check_password(senha, usuario.senha):
        return Response({'erro': 'E-mail ou senha inválidos.'}, status=401)

    return Response({
        'id': usuario.id,
        'nome': usuario.nome,
        'tipo_conta': usuario.tipo_conta,
    })