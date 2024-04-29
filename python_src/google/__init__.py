# importing
from __future__ import print_function
import os
# for 'Google API Integration'
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# client_secret.json is the credential file you get after creating 'Google OAuth 2' credential in Google



def createService(build_name, version):

    # If modifying these scopes, delete the file google_token.json.']
    scopes = ['https://www.googleapis.com/auth/contacts', 'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/drive']
    try:
        creds = None
        # The file google_token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first time.
        
        if os.path.exists("src/configs/google_token.json"):
            creds = Credentials.from_authorized_user_file("src/configs/google_token.json", scopes)

        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())

            else:
                flow = InstalledAppFlow.from_client_secrets_file("src/configs/client_secret.json", scopes)
                creds = flow.run_local_server(port=0)

            # Save the credentials for the next run
            with open(f"src/configs/google_token.json", 'w') as token:
                token.write(creds.to_json())

        service = build(build_name, version, credentials=creds)
        return service

    except:
        print("Your token has been expired")
        os.remove(f"app_configs/google_token.json")
        print("creating new token for you")
        createService(build_name, version)
