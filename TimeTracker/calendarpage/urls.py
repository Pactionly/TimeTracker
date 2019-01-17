from django.urls import path

from . import views

urlpatterns = [
    path('x/', views.mcx, name ='mcx'),
    path('accounts/profile/', views.mcx, name ='mcx'),
    path('', views.mycalendar, name='mycalendar'),
]
