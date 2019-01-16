from django.urls import path
 
from . import views

urlpatterns = [
    path('calendar/', views.mycalendar, name='mycalendar'),
    path('calendarX/', views.mcx, name ='mcx'),
]
         
