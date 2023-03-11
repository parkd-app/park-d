import pickle

from Service.firebase_query import set_by_key,query_by_key


def save_coordinates(data, angle):
    with open(
            "C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project"
            "\\park-d\\src\\pard-d-api\\static_resources\\coordinates_" + angle, "wb"
    ) as f:
        pickle.dump(data, f)
    return 1


def create_unique_key(id,name):
    return name + "_parking_" + str(id) + "_info"

def get_existing_layout(id,name):
    return query_by_key(create_unique_key(id,name))
def save_map_coordinate(data):
    parking_spec = data["parking_lots"]
    name = parking_spec["owner"]
    id = parking_spec["id"]
    set_by_key(create_unique_key(id,name), data)
    return 200









