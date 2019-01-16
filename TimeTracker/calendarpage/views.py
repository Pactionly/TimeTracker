from django.shortcuts import render

from django.http import HttpResponse
     
def index(request):
    return HttpResponse("<h1> CALENDAR PAGE")

def mycalendar(request):
    context = {}
    return render(request, 'calendar.html', context)



# Create your views here.
