from . import firebase_query


def get_parking_url(id,name):
    return firebase_query.query_by_key(create_key(id, name))

def set_parking_url(id,name,url):
    firebase_query.set_by_key(create_key(id, name), url)
    
def set_current_input(url):
    firebase_query.set_by_key("current_input", url)

def create_key(id, name):
    return name + "_" + str(id) + "_" + "parking_lot"

#set a key value pair where key is: current_coordinates: value is the key that stores current coordinates
def set_current_coordinates(id, name):
    firebase_query.set_by_key("current_coordinates", name + "_parking_" + str(id) + "_info")


def add_parking_lots_to_list(id,name):
    lot_key = "created_parking_lots"
    ret = firebase_query.query_by_key(lot_key)
    current_lots = ret["parking_lots"]
    current_lots.append({
        "id": id,
        "name": name
    })
    firebase_query.set_by_key(lot_key, ret)




