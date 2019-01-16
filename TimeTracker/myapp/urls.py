from django.urls import path
from django.contrib.auth import views as adminviews

from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('login/', adminviews.LoginView.as_view()),
  path('register/', views.register),
  path('logout/', views.logout_view), 
]
