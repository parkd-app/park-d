from flask import Flask
from flask import request
import logging
import json

from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# from flask_cors import CORS
#
# CORS(app)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config['CORS_HEADERS'] = 'Content-Type'

path = 'C:\\Users\\g7543\\OneDrive\\桌面\\Capstone_project\\park-d\\src\\park_d_model_service\\gaussian_model\\parking_lot_model_v1\\parking_info.txt'


@app.route('/rt_parking_info', methods=['GET'])
@cross_origin()
def requires_parking_spot():  # put application's code here
    with open(path, 'r') as f:
        parking_info = f.read()
    app.logger.info(parking_info)

    pro = str(parking_info).strip('[')[:-1]
    val = []
    ret = []
    for i in pro.split(','):
        i = i.strip()
        if i == 'True':
            val.append(True)
        else:
            val.append(False)
    for i, ele in enumerate(val):
        ret.append({
            'id': i + 1,
            'status' : ele
        })
    app.logger.info("ret: %s", ret)
    # response = Flask.jsonify({'parking_spaces': ret})
    # response.headers.add('Access-Control-Allow-Origin', '*')

    return {'parking_space': ret}


@app.route('/req_coordinate', methods=['GET'])
def requires_coordinate():
    return {'result': True}





if __name__ == '__main__':
    app.run()
