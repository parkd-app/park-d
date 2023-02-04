import sys
import os
from flask import Flask
import logging
from Service import parsing_service, slow_initiate_service
from Constants import constants
from flask_cors import CORS, cross_origin
import cv2

app = Flask(__name__)
CORS(app)

# from flask_cors import CORS
#
# CORS(app)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.before_first_request
def setup_logging():
    if not app.debug:
        # In production mode, add log handler to sys.stdout.
        app.logger.handlers.pop()
        if not app.logger.hasHandlers():
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(logging.Formatter(
                '%(asctime)s - [%(levelname)s] - [%(thread)d]'
                ' - [%(threadName)s] - %(name)s  - %(message)s'))
            app.logger.addHandler(handler)
            app.logger.setLevel(logging.DEBUG)
            app.logger.propagate = False
            app.logger.propagate = False
            app.logger.handler_set = True
        return app.logger


@app.route('/rt_parking_info', methods=['GET'])
@cross_origin()
def requires_parking_spot():  # put application's code here
    ret = parsing_service.parsing((constants.parking_info_path))
    app.logger.info("ret: %s", ret)
    # response = Flask.jsonify({'parking_spaces': ret})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return {'parking_space': ret}


@app.route('/req_coordinate', methods=['GET'])
def requires_coordinate():
    return {'result': True}


@app.route('/set_up', methods=['POST'])
def slow_initiate():
    ret = slow_initiate_service.start('side')
    return {'result': ret}


@app.route('/close_model', methods=['POST'])
def close_model():
    ret = slow_initiate_service.closemodel('side')
    return {'result': ret}


@app.route('/get_parking_snapshot', methods=['GET'])
def get_snapshot():
    vidcap = cv2.VideoCapture(constants.video_path_bird)
    success, image = vidcap.read()
    count = 0
    full_path = constants.image_path + "frame_bird.jpg"
    if(not os.path.exists(constants.image_path)):
        assert Exception
    if not cv2.imwrite(full_path, image):
        cv2.imwrite(".\\static_resources\\frame.png", image)
    print('Read a new frame:', success)
    count += 1
    return {'result': True}

if __name__ == '__main__':
    app.run()
