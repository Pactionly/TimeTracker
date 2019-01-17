"""Render view templates"""
from django.shortcuts import render

from django.http import HttpResponse

def index(request):
    """HTTP Response"""
    return HttpResponse("<h1> CALENDAR PAGE")

def mycalendar(request):
    """Render calendar template"""
    context = {}
    return render(request, 'calendar.html', context)

def mcx(request):
    """Render mcx template"""
    context = {}
    return render(request, 'mcx.html', context)



# Create your views here.
