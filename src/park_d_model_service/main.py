import yaml
from shapely.geometry import Polygon, Point
import pafy
from colors import *
from coordinates_generator import CoordinatesGenerator
import colors
from db import *
import numpy as np
import cv2

def judge_available(cars, spot):
    for car in cars:
        point = Point(car)
        poly = Polygon(spot)
        if poly.contains(point):
            return True
    return False
def upload_snap_shots():
    for i in ["Gary", "Jon"]:
        url = query_by_key(i + "_21_parking_lot")
        video = pafy.new(url)
        best = video.getbest(preftype="mp4")
        cap = cv2.VideoCapture(best.url)
        success, image = cap.read()
    # setting capture from the live stream
        full_path = "frame_bird_" + i +".jpg"
        if not cv2.imwrite(full_path, image):
            print("Read a new frame failed:", success)
            exit()
        image_file = full_path
        url = upload_snap_shot(full_path)
        set_by_key("snap_shot_" + i, url)
        cap.release()

def set_up_model():
    tiny = 0
    if tiny:
        cfg = "yolov3-tiny.cfg"
        weights = "yolov3-tiny.weights"
    else:
        cfg = "yolov3.cfg"
        weights = "yolov3.weights"

    # setting to run on the GPU
    net = cv2.dnn.readNetFromDarknet(cfg, weights)
    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
    return net

def commit_changes(key, value):
    set_by_key(key, value)

def main():
    # Load the YOLOv3 model
    net = set_up_model()
    # Load the car class names
    classes = []
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f.readlines()]

    #upload_snap_shots()
    url = query_by_key("current_input")
    video = pafy.new(url)
    best = video.getbest(preftype="mp4")
    cap = cv2.VideoCapture(best.url)
    #retriving one frame for labelling
    #Process coordinates
    image_file = "frame_bird_Gary.jpg"
    data_file = 'coordinates_2.yml'
    # with open(data_file, "w+") as points:
    #     generator = CoordinatesGenerator(image_file, points, COLOR_RED)
    #     generator.generate()
    # exit()

    # with open(data_file, "r") as data:
    #     spot_points = yaml.safe_load(data)

    current_coordinates = query_by_key("current_coordinates")
    result = query_by_key(current_coordinates)
    #total_spot_info = spot_points
    total_spot_info = result['parking_lots']['parking_spaces']
    while cap.isOpened():

        ret, img = cap.read()
        #
        # ret, img = cap.read()
        # # Get the height and width of the image
        # if img is None:
        #     break
        # if not ret:
        #     raise Exception
        height, width, _ = img.shape
        # Create a blob from the image and pass it through the YOLOv3 model
        blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), swapRB=True)
        net.setInput(blob)
        outs = net.forward(net.getUnconnectedOutLayersNames())

        # Get the class IDs, confidence scores, and bounding boxes of the detected objects
        class_ids = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5 and class_id == 2:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = center_x - w // 2
                    y = center_y - h // 2
                    class_ids.append(class_id)
                    confidences.append(float(confidence))
                    boxes.append([x, y, w, h])
                    #here x,y are top left corner
        # Perform non-maximum suppression to remove overlapping bounding boxes
        indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
        #car rendering
        cars_indices = []
        for i in indices:
            x, y, w, h = boxes[i][0], boxes[i][1], boxes[i][2], boxes[i][3]
            #cv2.rectangle(img, (x, y), (x + w, y + h), colors.COLOR_BLACK, 2)

            #text = f"({x + w//2}, {y + h//2})"
            #cv2.putText(img, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

            cars_indices.append((x + w//2, y + h//2))
        # spot rendering
        for spot_boundary in total_spot_info:
            #cam_coords = spot_boundary["coordinates"]
            cam_coords = spot_boundary["camcoords"]
            pts_array = np.array([cam_coords], dtype=np.int32)
            color = colors.COLOR_GREEN
            not_av = judge_available(cars_indices, cam_coords)
            spot_boundary['status'] = not not_av
            if not_av:
                color = colors.COLOR_BLUE
            cv2.polylines(img, pts_array, True, color, thickness=2)
        print("done updating: ", total_spot_info)
        result['parking_lots']['parking_spaces'] = total_spot_info
        print(result)
        commit_changes(current_coordinates,result)
        cv2.imshow("Car detection", img)
        break
        k = cv2.waitKey(1)
        if k == ord('q'):
            break
    cap.release()

    cv2.destroyAllWindows()


#cars is an array contains the boxes coordinates of the detected cars and spot is a array the current spot we are looking at

start_db()
main()



