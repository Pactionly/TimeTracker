"""Links for each page"""
from django.urls import path
from django.contrib.auth import views as adminviews

from . import views

urlpatterns = [
    path('sheets/', views.sheets_view),
    path('oauth2callback/', views.sheets_auth),
    path('', views.index, name='index'),
    path('login/', adminviews.LoginView.as_view()),
    path('register/', views.register),
    path('logout/', views.logout_view),
    path('timesheet/', views.sheets)
]
