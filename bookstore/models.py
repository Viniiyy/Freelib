from django.db import models
import uuid
import os
from django.utils.deconstruct import deconstructible
from django.conf import settings

@deconstructible
class RenameImage(object):
    def __init__(self, subdir = 'images'):
        self.subdir = subdir
    def __call__(self, instance, filename):
        extension = filename.split('.')[-1]
        new_name = f"{uuid.uuid4()}.{extension}"
        return os.path.join(self.subdir, new_name)

# Create your models here.
class Usuario(models.Model):
    class TipoConta(models.TextChoices):
        USUARIO = 'usuario', 'Usuário'
        FUNCIONARIO = 'funcionario', 'Funcionário'
        ADM = 'adm', 'Administrador'

    fotoPerfil = models.ImageField(upload_to=RenameImage('ftPerfil/'))
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    cpf = models.CharField(max_length=11)
    tipo_conta = models.CharField(
        max_length=20,
        choices=TipoConta.choices,
        default=TipoConta.USUARIO,
        editable=False,
    )

    @staticmethod
    def tipo_por_email(email):
        email = email.strip().lower()
        for tipo, sufixos in settings.TIPO_CONTA_POR_EMAIL.items():
            if any(email.endswith(s.lower()) for s in sufixos):
                return tipo
        return Usuario.TipoConta.USUARIO

    def save(self, *args, **kwargs):
        self.tipo_conta = self.tipo_por_email(self.email)
        super().save(*args, **kwargs)

    # Atalhos para usar em views e templates
    @property
    def is_adm(self):
        return self.tipo_conta == self.TipoConta.ADM

    @property
    def is_funcionario(self):
        return self.tipo_conta == self.TipoConta.FUNCIONARIO

    @property
    def pode_emprestar(self):
        return self.tipo_conta == self.TipoConta.USUARIO

class Categoria(models.Model):
    categoria = models.CharField(max_length=100)


class Livro(models.Model):
    imagem = models.ImageField(upload_to=RenameImage('images/'))
    titulo = models.CharField(max_length=50)
    descricao = models.TextField()
    dataEntrada = models.DateField()
    categoria = models.ForeignKey(Categoria, on_delete=models.DO_NOTHING)
    situacao = models.CharField(max_length=15)

class Emprestimo(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    data_emprestimo = models.DateField()
    data_devolucao = models.DateField()