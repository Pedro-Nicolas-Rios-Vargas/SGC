from django.urls import path
from .views import UsuarioView, CreateUsuarioView, borrar, actualizar, get, CambiarPass

urlpatterns = [
    path('users', UsuarioView.as_view()),
    path('create_user', CreateUsuarioView.as_view()),
    path('change_pass/', CambiarPass.as_view()),
    path('delete-user/<string:pk>', borrar),
    path('update-user/<string:pk>', actualizar),
    path('user/<string>', get),
]
