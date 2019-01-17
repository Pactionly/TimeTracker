"""Defines rendering logic for views"""
from django.shortcuts import render, redirect
from django.contrib.auth import logout

from . import forms

def index(request):
    """Render homepage"""
    context = {}
    return render(request, 'index.html', context)

def register(request):
    """Render register template"""
    if request.method == 'POST':
        registration_form = forms.RegistrationForm(request.POST)
        if registration_form.is_valid():
            registration_form.save(commit=True)
            return redirect("/")
        registration_form = forms.RegistrationForm()
    context = {
        "form":registration_form
    }
    return render(request, "registration/register.html", context=context)

def logout_view(request):
    """Render logout template"""
    logout(request)
    return redirect("/login/")
