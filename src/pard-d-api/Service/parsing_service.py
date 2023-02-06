import pickle
def parsing(path, angle):
    with open(path, 'r') as f:
        parking_info = f.read()

    pro = str(parking_info).strip('[')[:-1]
    val = []
    ret = []
    for i in pro.split(','):
        i = i.strip()
        if i == 'True':
            val.append(True)
        else:
            val.append(False)

    with open(
            "C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project"
            "\\park-d\\src\\pard-d-api\\static_resources\\coordinates_" + angle, "rb"
    ) as f:
        posList = pickle.load(f)
        print(posList)
        spaces = posList["parking_spaces"]

    for i, spot in enumerate(spaces):
        spot["open"] = val[i]
    print(posList)

    return posList
