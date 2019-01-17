from django.urls import path

from . import views

urlpatterns = [
    path('x/', views.outputCalText, name ='outputCalText'),
#    path('accounts/profile/', views.mcx, name ='mcx'),
    path('', views.addToCalendar, name='addToCalendar'),
]
