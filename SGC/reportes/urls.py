from django.urls import path
from .views import ReportesView, CreateReportesView, GeneranView, CrearGeneran, borrarReporte, updateReporte, CreateAlojanView, alojanFromView, OnlySaveReportesView, EnviarGeneran, GetGeneranUser
from .views import GetReporte, AlojanView, AdminSendMail, IniciarNuevoSem, borrarEntrega
urlpatterns = [
    path('reportes', ReportesView.as_view()),
    path('create-reporte', CreateReportesView.as_view()),
    path('generaciones', GeneranView.as_view()),
    path('alojan', AlojanView.as_view()),
    path('create-alojan', CreateAlojanView.as_view()),
    path('create-gen/<int:pk>', CrearGeneran),
    path('delete-reporte/<int:pk>', borrarReporte),
    path('update-reporte/<int:pk>', updateReporte),
    path('get-alojanFrom/<fk>', alojanFromView),
    path('save-reporte', OnlySaveReportesView.as_view()),
    path('send-genera/<pk>', EnviarGeneran),
    path('get-generan', GetGeneranUser),
    path('get-reporte/<pk>', GetReporte),
    path('admin-mail', AdminSendMail),
    path('startNew', IniciarNuevoSem),
    path('delete-Alojan/<pk>', borrarEntrega),
]
