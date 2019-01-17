from django.shortcuts import render

from django.http import HttpResponse
     
def index(request):
    return HttpResponse("<h1> CALENDAR PAGE")

def outputCalText(request):
    context = {}
    return render(request, 'outputCalText.html', context)

def addToCalendar(request):
    context = {}
    return render(request, 'addToCalendar.html', context)



# Create your views here.
