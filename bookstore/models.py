from django.db import models
import uuid
import os
from django.utils.deconstruct import deconstructible
from django.conf import settings


# Define o caminho e o nome dos arquivos de imagem utilizando identificadores únicos.
@deconstructible
class RenameImage(object):

    # Inicializa a classe definindo a pasta onde as imagens serão armazenadas.
    def __init__(self, subdir='images'):
        self.subdir = subdir

    # Gera um novo nome para a imagem, evitando conflitos entre arquivos.
    def __call__(self, instance, filename):
        extension = filename.split('.')[-1]
        new_name = f"{uuid.uuid4()}.{extension}"
        return os.path.join(self.subdir, new_name)


# Representa os usuários cadastrados no sistema e seus respectivos tipos de conta.
class Usuario(models.Model):

    # Define as categorias de contas disponíveis no sistema.
    class TipoConta(models.TextChoices):
        USUARIO = 'usuario', 'Usuário'
        FUNCIONARIO = 'funcionario', 'Funcionário'
        ADM = 'adm', 'Administrador'

    fotoPerfil = models.ImageField(upload_to=RenameImage('ftPerfil/'))
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    cpf = models.CharField(max_length=11)

    # Armazena o tipo de conta, definido automaticamente pelo endereço de e-mail.
    tipo_conta = models.CharField(
        max_length=20,
        choices=TipoConta.choices,
        default=TipoConta.USUARIO,
        editable=False,
    )

    # Identifica o tipo de conta com base nos sufixos de e-mail configurados no settings.py.
    @staticmethod
    def tipo_por_email(email):
        email = email.strip().lower()
        for tipo, sufixos in settings.TIPO_CONTA_POR_EMAIL.items():
            if any(email.endswith(s.lower()) for s in sufixos):
                return tipo
        return Usuario.TipoConta.USUARIO

    # Atualiza automaticamente o tipo de conta antes de salvar o usuário no banco de dados.
    def save(self, *args, **kwargs):
        self.tipo_conta = self.tipo_por_email(self.email)
        super().save(*args, **kwargs)

    # Verifica se o usuário possui uma conta de administrador.
    @property
    def is_adm(self):
        return self.tipo_conta == self.TipoConta.ADM

    # Verifica se o usuário possui uma conta de funcionário.
    @property
    def is_funcionario(self):
        return self.tipo_conta == self.TipoConta.FUNCIONARIO

    # Verifica se o usuário possui permissão para realizar empréstimos.
    @property
    def pode_emprestar(self):
        return self.tipo_conta == self.TipoConta.USUARIO


# Representa as categorias utilizadas para organizar os livros.
class Categoria(models.Model):
    categoria = models.CharField(max_length=100)


# Representa os livros cadastrados na biblioteca e suas respectivas informações.
class Livro(models.Model):
    imagem = models.ImageField(upload_to=RenameImage('images/'))
    titulo = models.CharField(max_length=50)
    descricao = models.TextField()
    dataEntrada = models.DateField()
    categoria = models.ForeignKey(Categoria, on_delete=models.DO_NOTHING)
    situacao = models.CharField(max_length=15)


# Representa os empréstimos de livros realizados pelos usuários da biblioteca.
class Emprestimo(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    data_emprestimo = models.DateField()
    data_devolucao = models.DateField()