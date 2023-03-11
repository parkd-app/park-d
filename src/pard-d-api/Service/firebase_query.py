import firebase_admin
import os
from firebase_admin import credentials
from firebase_admin import db


def start_db():
    current_dir = os.getcwd()
    parent_dir = os.path.dirname(current_dir)
    credential_path = "Service/park-d-dev-firebase-adminsdk-m7q98-c97bc3fdfc.json"

    cred = credentials.Certificate(credential_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://park-d-dev-default-rtdb.firebaseio.com/'
    })

def query_by_key(key):
    ref = db.reference()
    query = ref.order_by_key().equal_to(key)
    return query.get()[key]


def set_by_key(key,value):
    ref = db.reference('/')
    ret = ref.update({key:value})
    return  ret




