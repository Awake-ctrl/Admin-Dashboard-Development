# firebase_client.py
import firebase_admin
from firebase_admin import credentials, messaging
from pathlib import Path
import os

FIREBASE_CRED_PATH = os.getenv("FIREBASE_CREDENTIAL_PATH", "/path/to/firebase-service-account.json")

cred = credentials.Certificate(FIREBASE_CRED_PATH)
default_app = None
if not firebase_admin._apps:
    default_app = firebase_admin.initialize_app(cred)
