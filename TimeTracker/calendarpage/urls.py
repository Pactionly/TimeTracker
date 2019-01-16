from django.urls import path
 
from . import views

urlpatterns = [
    path('calendarpage/', views.index, name='index'),
]
         
