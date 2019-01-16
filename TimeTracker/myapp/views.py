from django.shortcuts import render, redirect
from django.contrib.auth import logout

import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build

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

def sheets_view(request):
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    '/code/client_secret',
    scopes=['https://www.googleapis.com/auth/drive']
  )
  flow.redirect_uri = 'http://localhost:8000/oauth2callback'
  authorization_url, state = flow.authorization_url(
    access_type='offline',
    include_granted_scopes='true'
  )
  return redirect(authorization_url)

def sheets_auth(request):
  state = request.GET.get('state', None)
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    '/code/client_secret',
    scopes=['https://www.googleapis.com/auth/drive'],
    state=state
  )
  flow.redirect_uri = 'http://localhost:8000/oauth2callback'
  authorization_response = request.build_absolute_uri()        
  flow.fetch_token(authorization_response=authorization_response)
  credentials = flow.credentials

  service = build('sheets', 'v4', credentials=credentials)

  # Call the Sheets API
  file_id = '1JuoSIWuGtA5S_KDx4NX7f_eJs_GsdgO5W0rjdzQgNVg'
  sheet = service.spreadsheets()
  range = 'Sheet2!B3:E3'
  body = {'values':[['1/15', 'Testing Output', 'TestHours', 'Debug']] }
  result = sheet.values().update(spreadsheetId=file_id, valueInputOption='USER_ENTERED', range=range, body=body).execute()

  return redirect('/')
