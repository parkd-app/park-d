import math
from . import save_coord_service as sd
from . import firebase_query

def  parsing(id, name):
    return firebase_query.query_by_key(sd.create_unique_key(id, name))
    #posList["parking_spaces"]
