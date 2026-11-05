# Importa a função responsável por criptografar as senhas dos usuários.
from django.contrib.auth.hashers import make_password

# Importa as ferramentas de serialização do Django REST Framework.
from rest_framework import serializers

# Importa os modelos do aplicativo bookstore.
from bookstore import models


# Converte os dados de Categoria para formatos compatíveis com a API.
class CategoriaSerializer(serializers.ModelSerializer):

    # Define o modelo utilizado e os campos que serão disponibilizados.
    class Meta:
        model = models.Categoria
        fields = '__all__'

        # Adiciona descrições aos campos para a documentação da API.
        extra_kwargs = {
            'id': {'help_text': 'Identificador da categoria'},
            'categoria': {'help_text': 'Nome da categoria'}
        }


# Converte os dados de Livro para formatos compatíveis com a API.
class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Livro
        fields = '__all__'

        # Adiciona descrições aos campos para facilitar sua identificação na API.
        extra_kwargs = {
            'id': {'help_text': 'Identificador do livro'},
            'imagem': {'help_text': 'Imagem do livro'},
            'titulo': {'help_text': 'Título do livro'},
            'descricao': {'help_text': 'Descrição do livro'},
            'dataEntrada': {'help_text': 'Data de entrada do livro'},
            'categoria': {'help_text': 'ID da categoria do livro. Buscar o ID no GET da API de Categoria'},
            'situacao': {'help_text': 'Situação atual do livro'}
        }


# Converte os dados de Emprestimo para formatos compatíveis com a API.
class EmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Emprestimo
        fields = '__all__'

        # Adiciona descrições aos campos utilizados nos empréstimos.
        extra_kwargs = {
            'id': {'help_text': 'Identificador do empréstimo'},
            'livro': {'help_text': 'ID do livro emprestado. Buscar o ID no GET da API de Livro'},
            'usuario': {'help_text': 'ID do usuário que realizou o empréstimo. Buscar o ID no GET da API de Usuário'},
            'data_emprestimo': {'help_text': 'Data em que o empréstimo foi realizado'},
            'data_devolucao': {'help_text': 'Data prevista para a devolução do livro'}
        }


# Converte os dados de Usuario para formatos compatíveis com a API.
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = '__all__'

        # Impede que o tipo de conta seja alterado diretamente pela API.
        read_only_fields = ['tipo_conta']

        # Define descrições e configurações adicionais para os campos.
        extra_kwargs = {
            'id': {'help_text': 'Identificador do usuário'},
            'fotoPerfil': {'help_text': 'Foto de perfil do usuário'},
            'nome': {'help_text': 'Nome completo do usuário'},
            'email': {'help_text': 'Endereço de e-mail do usuário'},
            'senha': {
                'help_text': 'Senha de acesso do usuário',

                # Impede que a senha seja exibida nas respostas da API.
                'write_only': True,
            },
            'cpf': {'help_text': 'Número do CPF do usuário'},
            'tipo_conta': {
                'help_text': 'Tipo da conta (definido automaticamente pelo e-mail)'
            },
        }

    # Criptografa a senha antes de armazená-la no banco de dados.
    def validate_senha(self, valor):
        return make_password(valor)


# Serializador utilizado para apresentar os empréstimos associados a um usuário.
class UsuarioEmprestimosSerializer(serializers.ModelSerializer):
    nome = serializers.CharField()
    LivroEmp = serializers.CharField()