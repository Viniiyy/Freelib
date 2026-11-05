"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from bookstore.api import viewsets
from rest_framework import routers, permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from bookstore import views
from django.conf import settings
from django.conf.urls.static import static




schema_view = get_schema_view(
    openapi.Info(
        title="Bookstore API",
        default_version='v1',
        description="API para documentar entrada e ssaida de livros",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="mRf0M@example.com"),
        license=openapi.License(name="Free"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,), 
)

route = routers.DefaultRouter()
route.register(r'Usuarios', viewsets.UsuarioViewSet, basename='Usuarios')
route.register(r'Livros', viewsets.LivroViewSet, basename='Livros')
route.register(r'Emprestimos', viewsets.EmprestimoViewSet, basename='Emprestimos')
route.register(r'Categorias', viewsets.CategoriaViewSet, basename='Categorias')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(route.urls)),
]

urlpatterns += [
    path('aswaggerjson/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('Login/', viewsets.login, name='login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
