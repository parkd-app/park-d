import sys
import os
from flask import Flask, send_file, render_template, Response
import logging
from Service import parsing_service,response_handler ,slow_initiate_service, model_selection_service, save_coord_service, coordinate_input_service, snap_shot_service
from Constants import constants
from flask_cors import CORS, cross_origin
#import cv2
from flask import request
import Service.firebase_query as db


app = Flask(__name__)
CORS(app)
db.start_db()
# from flask_cors import CORS
#
# CORS(app)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.config["CORS_HEADERS"] = "Content-Type"

#########################################################################
#PLEASE REFER TO API.PDF FOR THE USAGE OF ALL THE FOLLOWING APIS
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

#save the annotation for both camera view and map view
@app.route("/save_coord", methods=['POST'])
def save_coord():
    data = request.json
    ret = save_coord_service.save_map_coordinate(data)

    return response_handler.handle_response({'result': True})

@app.route("/")
def index():
   print('Request for index page received')
   return render_template('index.html')

# Reloading the layout from pre-annoated parking lots
@app.route("/get_prev_layout", methods=['POST'])
def get_layout():
    data = request.json
    ret = save_coord_service.get_existing_layout(data['id'], data['name'])
    return response_handler.handle_response({'result': ret})

#This API provides the real time information of parking lots
@app.route("/rt_parking_info", methods=['POST'])
@cross_origin()
def requires_parking_spot():  # put application's code here
    # angle = request.args.get('angle')
    # if angle == 'side':
    #     path = constants.PARKING_INFO_PATH
    # else:
    #     path = constants.PARKING_INFO_PATH_BIRD
    # ret = parsing_service.parsing(path, angle)
    # app.logger.info("ret: %s", ret)
    # # response = Flask.jsonify({'parking_spaces': ret})
    # # response.headers.add('Access-Control-Allow-Origin', '*')
    data = request.json
    id = data["parking_lot_id"]
    name = data["owner"]
    url = coordinate_input_service.get_parking_url(id, name)
    coordinate_input_service.set_current_input(url)
    coordinate_input_service.set_current_coordinates(id, name)
    return response_handler.handle_response(parsing_service.parsing(id,name))

#Request saving coordinates
@app.route("/req_coordinate", methods=["POST"])
def requires_coordinate():
    data = request.json
    ret = model_selection_service.saved_coordinates(data)
    return response_handler.handle_response({"result": ret })


@app.route("/set_up", methods=["POST"])
def slow_initiate():
    model = request.args.get("angle")
    ret = slow_initiate_service.start(model)
    return response_handler.handle_response({"result": ret})


@app.route("/close_model", methods=["POST"])
def close_model():
    ret = slow_initiate_service.closemodel("bird")
    return {"result": ret}

#This API returns the thumbnail link for a youtube steream which is used for annotation purposes
@app.route("/get_parking_snapshot", methods=['POST'])
def get_snapshot():
    name = request.args.get("name")
    url = request.json["url"]

    frame = snap_shot_service.save_frame_sec(url)
    #frame = db.down_load_snapshot(name)
    headers = {
        "Content-Type": "image/jpeg",
        "Content-Disposition": "attachment; filename=image.jpg"
    }
    response = Response(frame, headers=headers)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return send_file(frame, mimetype='image/jpeg')

#This API creates a Parking lot object and store the information to DB
@app.route("/create_parking_lot", methods=["POST"])
def create_parking_lots():
    data = request.json
    id = data["id"]
    name = data["name"]
    url = data["url"]
    coordinate_input_service.set_parking_url(id,name,url)
    coordinate_input_service.add_parking_lots_to_list(id, name)
    return response_handler.handle_response({"result:": True})

#This API returns the information for all parking lots for front end rendering parking lot
@app.route("/get_all_parking_lots", methods=['POST'])
def get_parking_lots_for_render():
    lot_key = "created_parking_lots"
    ret = db.query_by_key(lot_key)
    return response_handler.handle_response(ret)
@app.route("/get_analytics", methods=['POST'])
def get_analytics():
    return {"ret": True}

if __name__ == "__main__":
    app.run()

