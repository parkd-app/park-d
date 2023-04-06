#import pickle

SUCCESS = 200
#coordinates_3 for test
def saved_coordinates(data):
    if data['identifier'] == 'side':
        with open(
                "C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project\\park-d\\"
                "src\\park_d_model_service\\gaussian_model\\"
                "parking_lot_model_v1\\data\\coordinates_3.yml",
                "w+"
        ) as points:
            coorall = data['coordinates']
            for coor in coorall:
                for i, coordinates in enumerate(coor):
                    points.write(
                        "-\n          id: "
                        + str(i)
                        + "\n          coordinates: ["
                        + "["
                        + str(coordinates[0][0])
                        + ","
                        + str(coordinates[0][1])
                        + "],"
                        + "["
                        + str(coordinates[1][0])
                        + ","
                        + str(coordinates[1][1])
                        + "],"
                        + "["
                        + str(coordinates[2][0])
                        + ","
                        + str(coordinates[2][1])
                        + "],"
                        + "["
                        + str(coordinates[3][0])
                        + ","
                        + str(coordinates[3][1])
                        + "]]\n"
                    )
    #carpost2 for setup
    else:
        posList = []
        for pairs in data['coordinates']:
            posList.append((pairs[0], pairs[1]))
        print(posList)
        with open(
                "C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project"
                "\\park-d\\src\\park_d_model_service\\Bird_view model\\carParkPos2", "wb"
        ) as f:
            pickle.dump(posList, f)
    return SUCCESS



# -
#           id: 0
#           coordinates: [[92,501],[241,664],[409,587],[243,440]]
# -
#           id: 1
#           coordinates: [[280,454],[417,582],[508,528],[345,427]]
# -
#           id: 2
#           coordinates: [[424,459],[517,523],[584,476],[435,429]]
# -
#           id: 3
#           coordinates: [[475,433],[603,469],[649,433],[504,398]]
# -
#           id: 4
#           coordinates: [[158,380],[220,356],[157,327],[109,344]]
# -
#           id: 5
#           coordinates: [[309,341],[364,329],[291,309],[263,317]]
