"""Defines rendering logic for views"""
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

import google.oauth2.credentials
import google_auth_oauthlib.flow
import httplib2
from googleapiclient.discovery import build
from oauth2client import client, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI

from . import forms
from . import models

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
    """Logout User"""
    logout(request)
    return redirect("/login/")

@login_required
def sheets_view(request):
    """Google Authentication"""
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

@login_required
def sheets_auth(request):
    """Called After Google Auth"""
    state = request.GET.get('state', None)
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      '/code/client_secret',
      scopes=['https://www.googleapis.com/auth/drive'],
      state=state
    )
    code = request.GET.get('code', None)
    flow.redirect_uri = 'http://localhost:8000/oauth2callback'
    authorization_response = request.build_absolute_uri()        
    flow.fetch_token(code=code) 
    credentials = flow.credentials

    if credentials.refresh_token:
        token = models.AuthModel(
          id = request.user,
          refresh_key = credentials.refresh_token
        )
        token.save()
    credentials = client.OAuth2Credentials(
      access_token = None,
      client_id = credentials.client_id,
      client_secret = credentials.client_secret,
      refresh_token = request.user.AuthModel.refresh_key,
      token_expiry = None,
      token_uri = GOOGLE_TOKEN_URI,
      user_agent = None,
      revoke_uri = GOOGLE_REVOKE_URI
    )
    service = build('sheets', 'v4', credentials=credentials)
    # Call the Sheets API
    file_id = '1JuoSIWuGtA5S_KDx4NX7f_eJs_GsdgO5W0rjdzQgNVg'
    sheet = service.spreadsheets()
    range = 'Sheet2!B3:E3'
    body = {'values':[['1/15', 'Testing Output', 'TestHours', 'Debug']] }
    result = sheet.values().update(spreadsheetId=file_id, valueInputOption='USER_ENTERED', range=range, body=body).execute()

    return redirect('/')
