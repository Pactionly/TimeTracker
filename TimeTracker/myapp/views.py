from django.shortcuts import render, redirect
from django.contrib.auth import logout

from . import forms
# Create your views here.
from django.http import HttpResponse


def index(request):
    context = {}
    return render(request, 'index.html', context)

def register(request):
     if request.method == 'POST':
         registration_form = forms.RegistrationForm(request.POST)
         if registration_form.is_valid():
             registration_form.save(commit=True)
             return redirect("/")
     else:
         registration_form = forms.RegistrationForm()
     context = {
         "form":registration_form
         }
     return render(request, "registration/register.html", context=context)

def logout_view(request):
  logout(request)
  return redirect("/login/")

