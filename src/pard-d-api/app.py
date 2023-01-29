from flask import Flask
from flask import request
import logging
import json
from Service import parsing_service

from Constants import Constants
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# from flask_cors import CORS
#
# CORS(app)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/rt_parking_info', methods=['GET'])
@cross_origin()
def requires_parking_spot():  # put application's code here
    ret = parsing_service.parsing((Constants.parking_info_path)
    app.logger.info("ret: %s", ret)
    # response = Flask.jsonify({'parking_spaces': ret})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return {'parking_space': ret}


@app.route('/req_coordinate', methods=['GET'])
def requires_coordinate():
    return {'result': True}


@app.route('set_up', methods=['POST'])
def slow_initiate():


@app.route('get_parking_snapshot', methods=['GET'])
def get_snapshot():






if __name__ == '__main__':
    app.run()
