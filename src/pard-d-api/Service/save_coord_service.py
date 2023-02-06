import pickle

def save_coordinates(data, angle):
    with open(
            "C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project"
            "\\park-d\\src\\pard-d-api\\static_resources\\coordinates_" + angle, "wb"
    ) as f:
        pickle.dump(data, f)
    return 1
