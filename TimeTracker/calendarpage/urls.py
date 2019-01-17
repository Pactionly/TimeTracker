from django.urls import path

from . import views

urlpatterns = [
    path('x/', views.mycalendar, name ='mycalendar'),
    path('accounts/profile/', views.mcx, name ='mcx'),
    path('', views.mcx, name='mcx'),
]
