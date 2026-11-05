from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from bookstore import models


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Categoria
        fields = '__all__'
        extra_kwargs = {
            'id': {'help_text': 'Identificador da categoria'},
            'categoria': {'help_text': 'Nome da categoria'}
        }


class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Livro
        fields = '__all__'
        extra_kwargs = {
            'id': {'help_text': 'Identificador do livro'},
            'imagem': {'help_text': 'Imagem do livro'},
            'titulo': {'help_text': 'Título do livro'},
            'descricao': {'help_text': 'Descrição do livro'},
            'dataEntrada': {'help_text': 'Data de entrada do livro'},
            'categoria': {'help_text': 'ID da categoria do livro. Buscar o ID no GET da API de Categoria'},
            'situacao': {'help_text': 'Situação atual do livro'}
        }


class EmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Emprestimo
        fields = '__all__'
        extra_kwargs = {
            'id': {'help_text': 'Identificador do empréstimo'},
            'livro': {'help_text': 'ID do livro emprestado. Buscar o ID no GET da API de Livro'},
            'usuario': {'help_text': 'ID do usuário que realizou o empréstimo. Buscar o ID no GET da API de Usuário'},
            'data_emprestimo': {'help_text': 'Data em que o empréstimo foi realizado'},
            'data_devolucao': {'help_text': 'Data prevista para a devolução do livro'}
        }


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = '__all__'
        read_only_fields = ['tipo_conta']
        extra_kwargs = {
            'id': {'help_text': 'Identificador do usuário'},
            'fotoPerfil': {'help_text': 'Foto de perfil do usuário'},
            'nome': {'help_text': 'Nome completo do usuário'},
            'email': {'help_text': 'Endereço de e-mail do usuário'},
            'senha': {
                'help_text': 'Senha de acesso do usuário',
                'write_only': True,
            },
            'cpf': {'help_text': 'Número do CPF do usuário'},
            'tipo_conta': {
                'help_text': 'Tipo da conta (definido automaticamente pelo e-mail)'
            },
        }

    def validate_senha(self, valor):
        return make_password(valor)

class UsuarioEmprestimosSerializer(serializers.ModelSerializer):
    nome = serializers.CharField()
    LivroEmp = serializers.CharField()