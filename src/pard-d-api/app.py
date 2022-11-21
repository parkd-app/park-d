from flask import Flask
from flask import request
import logging
import json
app = Flask(__name__)
app.logger.setLevel(logging.INFO)

path = 'C:\\Users\\Gary Gong\\Desktop\\ML_model\\ParkingLot\\parking_lot\\parking_info.txt'


@app.route('/rt_parking_info', methods=['GET'])
def requires_parking_spot():  # put application's code here
    with open(path, 'r') as f:
        parking_info = f.read()
    app.logger.info(parking_info)

    pro = str(parking_info).strip('[')[:-1]

    val = []
    ret = []
    for i in pro.split(','):
        print(i.strip())
        if i == 'True':
            val.append(True)

        else:
            val.append(False)
    for i, ele in enumerate(val):
        ret.append({
            'id': i + 1,
            'status' : ele
        })

    return {
        'parking_spaces': ret
    }


@app.route('/req_coordinate', methods=['GET'])
def requires_coordinate():
    pass





if __name__ == '__main__':
    app.run()
