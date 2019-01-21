"""Defines rendering logic for views"""

from datetime import datetime
import pytz

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

import datetime
import google_auth_oauthlib.flow

from . import forms
from . import models
from . import util


@login_required
def rest_clock_in(request):
    """ REST API for clock in requests"""
    if request.method != 'POST':
        return HttpResponse('Invalid Method')
    if request.user.ClockInModel.time:
        return HttpResponse('Already Clocked In')
    time_zone = pytz.timezone('America/Los_Angeles')
    request.user.ClockInModel.time = time_zone.localize(datetime.now())
    request.user.ClockInModel.save()
    return HttpResponse('Success')

@login_required
def rest_clock_out(request):
    """ REST API for clock out requests
        Requires Timesheet Form"""
    if request.method != 'POST':
        return HttpResponse('Invalid Method')
    if not request.user.ClockInModel.time:
        return HttpResponse('Not Clocked In')
    # Hours Worked Rounded to nearest quarter hour
    hours_worked = round(util.current_seconds_worked(request.user) / 900) / 4

    clock_out_form = forms.TimesheetForm(request.POST)
    if not clock_out_form.is_valid():
        return HttpResponse('Invalid Form')

    service = util.authenticate(request.user, 'sheets', 'v4')
    # pylint: disable=line-too-long
    # pylint: disable=no-member
    sheet_info = service.spreadsheets().get(spreadsheetId=clock_out_form.cleaned_data['sheet_id']).execute()
    body = {'values':[[
        util.current_day(),
        clock_out_form.cleaned_data['activity'],
        hours_worked,
        clock_out_form.cleaned_data['comments']
    ]]}
    insert_body = {'requests': [
        {
            "insertDimension": {
                "range": {
                    "sheetId": sheet_info['sheets'][1]['properties']['sheetId'],
                    "dimension": "ROWS",
                    "startIndex": 1,
                    "endIndex": 2
                },
                "inheritFromBefore": False
            }
        }
    ]}
    # pylint: disable=no-member
    service.spreadsheets().batchUpdate(
        spreadsheetId=clock_out_form.cleaned_data['sheet_id'],
        body=insert_body
    ).execute()

    sheet_range = 'Sheet2!B3:E3'
    # pylint: disable=no-member
    service.spreadsheets().values().update(
        spreadsheetId=clock_out_form.cleaned_data['sheet_id'],
        valueInputOption='USER_ENTERED',
        range=sheet_range,
        body=body
    ).execute()
    request.user.ClockInModel.time = None
    request.user.ClockInModel.save()
    return redirect('/')
def index(request):
    """Render homepage"""
    pressed = False
    now = datetime.datetime.now()
    context = {
        'pressed': pressed,
        'now': now
    }
    return render(request, 'index.html', context)

def register(request):
    """Render register template"""
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
    """Logout User"""
    logout(request)
    return redirect("/login/")

@login_required
def profile(request):
    context = {}
    return render(request, 'profile.html', context)

@login_required
def sheets(request):
    """View to display sheet update form"""
    if request.method == 'POST':
        sheet_form = forms.TimesheetForm(request.POST)
        if sheet_form.is_valid():
            service = util.authenticate(request.user, 'sheets', 'v4')
            if not service:
                return redirect('/begin_google_auth')
            sheet_range = 'Sheet2!B3:E3'
            body = {'values': [[
                'TestDate',
                sheet_form.cleaned_data['activity'],
                '8',
                sheet_form.cleaned_data['comments']
            ]]}
            # pylint: disable=no-member
            service.spreadsheets().values().update(
                spreadsheetId=sheet_form.cleaned_data['sheet_id'],
                valueInputOption='USER_ENTERED',
                range=sheet_range,
                body=body
            ).execute()
            return redirect('/')
    else:
        sheet_form = forms.TimesheetForm()
    context = {
        'form': sheet_form
    }
    return render(request, 'timesheet.html', context=context)

@login_required
def begin_google_auth(request):
    """Google Authentication"""
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        '/code/client_secret',
        scopes=['https://www.googleapis.com/auth/drive']
    )
    flow.redirect_uri = 'http://localhost:8000/oauth2callback'
    # pylint: disable=unused-variable
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    return redirect(authorization_url)

@login_required
def sheets_auth(request):
    """Called After Google Auth"""
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        '/code/client_secret',
        scopes=['https://www.googleapis.com/auth/drive'],
    )
    code = request.GET.get('code', None)
    flow.redirect_uri = 'http://localhost:8000/oauth2callback'
    flow.fetch_token(code=code)
    credentials = flow.credentials

    if credentials.refresh_token:
        token = models.AuthModel(
            id=request.user,
            refresh_key=credentials.refresh_token
        )
        token.save()

    return redirect('/')
