"""Links for each page"""
from django.urls import path
from django.contrib.auth import views as adminviews

from . import views

urlpatterns = [
    path('begin_google_auth/', views.begin_google_auth),
    path('finish_google_auth/', views.finish_google_auth),
    path('', views.index, name='index'),
    path('login/', adminviews.LoginView.as_view()),
    path('register/', views.register),
    path('logout/', views.logout_view),
    path('timesheet/', views.sheets),
    path('clock_out/', views.rest_clock_out),
    path('profile/', views.profile),
    path('edit_profile/', views.edit_profile),
    path('clock_in/', views.rest_clock_in),
    path('work_stats/', views.rest_work_stats),
    path('rest_calendar/', views.rest_calendar),
]
