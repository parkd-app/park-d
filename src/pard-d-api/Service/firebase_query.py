import datetime

import firebase_admin
import os
from firebase_admin import credentials
from firebase_admin import db, storage


def start_db():
    current_dir = os.getcwd()
    parent_dir = os.path.dirname(current_dir)
    credential_path = "Service/park-d-dev-firebase-adminsdk-m7q98-c97bc3fdfc.json"
    cred = credentials.Certificate(credential_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://park-d-dev-default-rtdb.firebaseio.com/',
        'storageBucket': 'park-d-dev.appspot.com'})

def query_by_key(key):
    ref = db.reference()
    query = ref.order_by_key().equal_to(key)

    return query.get()[key]


def set_by_key(key, value):
    ref = db.reference('/')
    ret = ref.update({key:value})
    return  ret

def down_load_snapshot(name):
    bucket = storage.bucket()
    image_blob = bucket.blob("Rev1_" + name + ".jpg")
    image_bytes = image_blob.download_as_bytes()
    return image_bytes

def get_down_load_link(name):
    bucket = storage.bucket()
    image_blob = bucket.blob("Rev1_" + name + ".jpg")
    url = image_blob.generate_signed_url(
        version="v4",
        # This URL is valid for 15 minutes
        expiration=datetime.timedelta(minutes=30),
        # Allow GET requests using this URL.
        method="GET",
    )
    return url







