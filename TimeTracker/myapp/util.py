"""Utility Functions"""

import json
from datetime import datetime
import pytz

from oauth2client import client, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI
from googleapiclient.discovery import build


def authenticate(user, api, version):
    """Returns google service"""

    with open('/code/client_secret', 'r') as file:
        client_secret_file = json.load(file)
    try:
        credentials = client.OAuth2Credentials(
            access_token=None,
            client_id=client_secret_file['web']['client_id'],
            client_secret=client_secret_file['web']['client_secret'],
            refresh_token=user.AuthModel.refresh_key,
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
    if user and hasattr(user, 'ClockInModel') and user.ClockInModel.time:
        now = pytz.timezone('America/Los_Angeles').localize(datetime.now())
        time_diff = now - user.ClockInModel.time
        return time_diff.total_seconds()
    return 0

def current_day():
    """Returns current day formatted as m/d"""
    now = pytz.timezone('America/Los_Angeles').localize(datetime.now())
    return now.strftime('%m/%d')
