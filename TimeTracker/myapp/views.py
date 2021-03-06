"""Defines rendering logic for views"""

from datetime import datetime
import pytz

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

import google_auth_oauthlib.flow
from oauth2client import client

from . import forms
from . import util


@login_required
def rest_calendar(request):
    """Returns json containing calendar data for the logged in user
       {
         calendarLists: [
           {
             'name': string,
             'primary': bool,
             'events': [{GoogleEventJSON}]
           }
         ]
       }
    """
    if request.method == 'GET':
        service = util.authenticate(request.user, 'calendar', 'v3')

        json = {
            'calendarLists':[]
        }
        # pylint: disable=no-member
        cal_lists = service.calendarList().list().execute()
        for entry in cal_lists['items']:
            json['calendarLists'].append({
                'name': entry['summary'].split('@')[0],
                'primary': 'primary' in entry and entry['primary'],
                # pylint: disable=no-member
                'events': (
                    service
                    .events()
                    .list(
                        calendarId=entry['id'],
                        maxResults=15
                    )
                    .execute()
                )
            })
        return JsonResponse(json)
    return HttpResponseBadRequest('Invalid Method')


@login_required
def rest_work_stats(request):
    """Returns json containing the hours worked for the last five entries
       and the total hours worked in this pay period
       {
         hours: 0.0
         daily_stats: [
           {
             date: '01/01'
             hours: 0.0
           },
           ...
         ]
       }
    """
    if request.method != 'GET':
        return HttpResponse('Invalid Method')
    service = util.authenticate(request.user, 'sheets', 'v4')
    try:
        sheet_info = (
            # pylint: disable=no-member
            service.spreadsheets()
            .get(spreadsheetId=request.user.profile.sheet_id)
            .execute()
        )
    except client.HttpAccessTokenRefreshError:
        return redirect('/begin_google_auth')

    json = {
        'hours': 0,
        'daily_stats': []
    }
    if request.user.profile.sheet_id == '':
        return JsonResponse(json)

    sheet_range = sheet_info['sheets'][1]['properties']['title'] + '!B3:E1000'

    try:
        # pylint: disable=no-member
        data = service.spreadsheets().values().get(
            spreadsheetId=request.user.profile.sheet_id,
            range=sheet_range
        ).execute()['values']
    except client.HttpAccessTokenRefreshError:
        return redirect('/begin_google_auth')

    for entry in data:
        if not util.entry_valid(entry):
            continue
        json['daily_stats'].append({
            'date': entry[0],
            'hours': float(entry[2])
        })
    for entry in data:
        if not util.entry_valid(entry):
            continue
        if util.is_end_of_period(entry[0]):
            break
        json['hours'] += float(entry[2])

    return JsonResponse(json)

@login_required
def rest_clock_in(request):
    """ REST API for clock in requests"""
    if request.method != 'POST':
        return HttpResponseBadRequest('Invalid Method')
    if request.user.profile.clock_in_time:
        return HttpResponseBadRequest('Already Clocked In')
    time_zone = pytz.timezone('America/Los_Angeles')
    request.user.profile.clock_in_time = time_zone.localize(datetime.now())
    request.user.save()
    return redirect('/')

@login_required
def rest_clock_out(request):
    """ REST API for clock out requests
        Requires Timesheet Form"""
    if request.method != 'POST':
        return HttpResponseBadRequest('Invalid Method')
    if not request.user.profile.clock_in_time:
        return HttpResponseBadRequest('Not Clocked In')
    if not request.user.profile.sheet_id:
        return HttpResponseBadRequest('No SheetID')

    # Hours Worked Rounded to nearest quarter hour
    hours_worked = round(util.current_seconds_worked(request.user) / 900) / 4

    clock_out_form = forms.TimesheetForm(request.POST)
    if not clock_out_form.is_valid():
        return HttpResponseBadRequest('Invalid Form')

    service = util.authenticate(request.user, 'sheets', 'v4')
    try:
        sheet_info = (
            # pylint: disable=no-member
            service.spreadsheets()
            .get(spreadsheetId=request.user.profile.sheet_id)
            .execute()
        )
    except client.HttpAccessTokenRefreshError:
        return redirect('/begin_google_auth')


    body = {
        'values':[[
            util.current_day(),
            clock_out_form.cleaned_data['activity'],
            hours_worked,
            clock_out_form.cleaned_data['comments']
        ]]
    }

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
        spreadsheetId=request.user.profile.sheet_id,
        body=insert_body
    ).execute()

    sheet_range = sheet_info['sheets'][1]['properties']['title'] + '!B3:E3'

    # pylint: disable=no-member
    service.spreadsheets().values().update(
        spreadsheetId=request.user.profile.sheet_id,
        valueInputOption='USER_ENTERED',
        range=sheet_range,
        body=body
    ).execute()

    request.user.profile.clock_in_time = None
    request.user.save()
    return redirect('/')

def index(request):
    """Render homepage"""
    if not request.user.is_authenticated:
        return redirect("/login")
    clocked_in = request.user.profile.clock_in_time is not None
    now = datetime.now()
    sheet_form = forms.TimesheetForm()
    seconds_worked = util.current_seconds_worked(request.user)
    minutes_worked = seconds_worked / 60
    hours_worked = round(minutes_worked // 60)
    minutes_worked = round(minutes_worked % 60)
    context = {
        'clocked_in': clocked_in,
        'now': now,
        'sheet_form': sheet_form,
        'minutes_worked': minutes_worked,
        'hours_worked': hours_worked,
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
    """Renders Profile"""
    if request.method == 'POST':
        profile_form = forms.ProfileForm(request.POST)
        user = request.user
        if profile_form.is_valid():
            user.first_name = profile_form.cleaned_data['first_name']
            user.last_name = profile_form.cleaned_data['last_name']
            user.profile.sheet_id = profile_form.cleaned_data['sheet_id']
            user.email = profile_form.cleaned_data['email']
            user.save()
        return redirect('/profile/')
    editing = False
    context = {
        'editing': editing,
    }
    return render(request, 'profile.html', context)

@login_required
def edit_profile(request):
    """Enables the editing of the user profile"""
    editing = True
    user = request.user
    data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'sheet_id': user.profile.sheet_id,
        'email': user.email
    }
    profile_form = forms.ProfileForm(initial=data)
    context = {
        'editing': editing,
        'profile_form': profile_form
    }
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
        '/code/client_secret.json',
        scopes=[
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar'
        ]
    )
    flow.redirect_uri = request.build_absolute_uri('/finish_google_auth/')
    # pylint: disable=unused-variable
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    return redirect(authorization_url)

@login_required
def finish_google_auth(request):
    """Called After Google Auth"""
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        '/code/client_secret.json',
        scopes=[
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar'
        ],
    )
    code = request.GET.get('code', None)
    flow.redirect_uri = request.build_absolute_uri('/finish_google_auth/')
    flow.fetch_token(code=code)
    credentials = flow.credentials

    if credentials.refresh_token:
        request.user.profile.refresh_key = credentials.refresh_token
        request.user.save()
    return redirect('/')
