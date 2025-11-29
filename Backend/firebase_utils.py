# firebase_utils.py
from firebase_admin import messaging

def send_push_to_token(token: str, title: str, body: str, data: dict = None):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        data=data or {},
        token=token
    )
    return messaging.send(message)

def send_push_to_tokens(tokens: list[str], title: str, body: str, data: dict = None):
    # Use multicast for up to 500 tokens at once
    message = messaging.MulticastMessage(
        notification=messaging.Notification(title=title, body=body),
        data=data or {},
        tokens=tokens
    )
    response = messaging.send_multicast(message)
    return response  # contains success_count, responses...
