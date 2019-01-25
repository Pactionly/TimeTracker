"""Utility Functions"""

import json
from datetime import datetime
import pytz

from oauth2client import client, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI
from googleapiclient.discovery import build



def is_end_of_period(date):
    month = date[0:2]
    day = date[3:]
    return True

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
