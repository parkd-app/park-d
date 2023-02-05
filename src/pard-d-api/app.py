import sys
import os
from flask import Flask, send_file
import logging
from Service import parsing_service, slow_initiate_service
from Constants import constants
from flask_cors import CORS, cross_origin
import cv2
from flask import request

app = Flask(__name__)
CORS(app)

# from flask_cors import CORS
#
# CORS(app)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config["CORS_HEADERS"] = "Content-Type"


@app.before_first_request
def setup_logging():
    if not app.debug:
        app.logger.handlers.pop()
        if not app.logger.hasHandlers():
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(
                logging.Formatter(
                    "%(asctime)s - [%(levelname)s] - [%(thread)d]"
                    " - [%(threadName)s] - %(name)s  - %(message)s"
                )
            )
            app.logger.addHandler(handler)
            app.logger.setLevel(logging.DEBUG)
            app.logger.propagate = False
            app.logger.propagate = False
            app.logger.handler_set = True
        return app.logger


@app.route("/rt_parking_info", methods=["GET"])
@cross_origin()
def requires_parking_spot():  # put application's code here
    ret = parsing_service.parsing((constants.PARKING_INFO_PATH))
    app.logger.info("ret: %s", ret)
    # response = Flask.jsonify({'parking_spaces': ret})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return {"parking_space": ret}


@app.route("/req_coordinate", methods=["GET"])
def requires_coordinate():
    return {"result": True}


@app.route("/set_up", methods=["POST"])
def slow_initiate():
    model = request.args.get("angle")
    app.logger.info("model", model)
    ret = slow_initiate_service.start(model)
    return {"result": ret}


@app.route("/close_model", methods=["POST"])
def close_model():
    ret = slow_initiate_service.closemodel("bird")
    return {"result": ret}


@app.route("/get_parking_snapshot", methods=["GET"])
def get_snapshot():
    model = request.args.get("angle")
    vidcap = cv2.VideoCapture(constants.VIDEO_PATH_BIRD)
    success, image = vidcap.read()
    if image:
        full_path = constants.IMAGE_PATH + "frame_bird.jpg"
        if not os.path.exists(constants.IMAGE_PATH):
            assert Exception
        if not cv2.imwrite(full_path, image):
            cv2.imwrite(".\\static_resources\\frame.png", image)
        print("Read a new frame:", success)
    else:
        if model == "side":
            ret = send_file(
                "./static_resources/parking_lot_2.png", mimetype="image/png"
            )
        else:
            ret = send_file(
                "./static_resources/bird.png", mimetype="image/png"
            )

    return ret


if __name__ == "__main__":
    app.run()
