"""Render view templates"""
from django.shortcuts import render

from django.http import HttpResponse

def index(request):
    """HTTP Response"""
    return HttpResponse("<h1> CALENDAR PAGE")

def outputCalText(request):
    """Render outputCalText template"""
    context = {}
    return render(request, 'outputCalText.html', context)

def addToCalendar(request):
    """Render addToCalendar template"""
    context = {}
    return render(request, 'addToCalendar.html', context)



# Create your views here.
