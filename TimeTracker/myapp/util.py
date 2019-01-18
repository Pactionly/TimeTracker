from oauth2client import client, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI
from googleapiclient.discovery import build

import json


def authenticate(user, api, version):
    """Returns google service"""

    with open('/code/client_secret', 'r') as f:
        client_secret_file = json.load(f)
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
    except Exception as e:
        print(e)
        return None


