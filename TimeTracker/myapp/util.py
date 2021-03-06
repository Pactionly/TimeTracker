"""Utility Functions"""

import re
import json
from datetime import datetime
import pytz

from oauth2client import client, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI
from googleapiclient.discovery import build




def entry_valid(entry):
    """ Checks if a spreadsheet entry for a day is valid, meaning it has all
        fields filled in a way that makes sense """

    if len(entry) != 4:
        return False
    date_list = re.split('\\W', entry[0])
    if len(date_list) != 2:
        return False
    try:
        int(date_list[0])
        int(date_list[1])
        float(entry[2])
    except ValueError:
        return False
    return True

def is_end_of_period(date):
    """Returns True if the given date 'mm/dd' is the end of a pay period,
       False otherwise"""
    date_list = re.split('\\W', date)
    month = int(date_list[0])
    day = int(date_list[1])
    if day == 15:
        return True
    days_per_month = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if day == days_per_month[month]:
        return True
    return False

def authenticate(user, api, version):
    """Returns google service"""

    with open('/code/client_secret.json', 'r') as file:
        client_secret_file = json.load(file)
    try:
        credentials = client.OAuth2Credentials(
            access_token=None,
            client_id=client_secret_file['web']['client_id'],
            client_secret=client_secret_file['web']['client_secret'],
            refresh_token=user.profile.refresh_key,
            token_expiry=None,
            token_uri=GOOGLE_TOKEN_URI,
            user_agent=None,
            revoke_uri=GOOGLE_REVOKE_URI
        )
        return build(api, version, credentials=credentials)
    # pylint: disable=broad-except
    except Exception as exc:
        print(exc)
        return None

def current_seconds_worked(user):
    """Returns the number of seconds worked since clocking in"""
    if not user.profile.clock_in_time:
        return 0
    now = pytz.timezone('America/Los_Angeles').localize(datetime.now())
    time_diff = now - user.profile.clock_in_time
    return time_diff.total_seconds()

def current_day():
    """Returns current day formatted as m/d"""
    now = pytz.timezone('America/Los_Angeles').localize(datetime.now())
    return now.strftime('%m/%d')
