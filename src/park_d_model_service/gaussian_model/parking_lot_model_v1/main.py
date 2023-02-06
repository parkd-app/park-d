import argparse
from coordinates_generator import CoordinatesGenerator
from motion_detector import MotionDetector
from colors import COLOR_RED
import logging
import yaml
import socket

# python main.py --image images/parking_lot_2.png --data data/coordinates_2.yml --video videos/parking_lot_2.mp4 --start-frame 200
def main():
    logging.basicConfig(level=logging.INFO)

    args = parse_args()

    image_file = args.image_file
    data_file = args.data_file
    start_frame = args.start_frame

    if image_file is not None:
        with open(data_file, "w+") as points:
            generator = CoordinatesGenerator(image_file, points, COLOR_RED)
            generator.generate()

    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.bind(("localhost", 12000))
    print("model start listening for request")

    while serversocket.listen() != -1:
        connection, address = serversocket.accept()
        data = connection.recv(1024)
        if data == "close":
            serversocket.close()
            break

        with open(data_file, "r") as data:
            points = yaml.load(data)
            print(points)
            detector = MotionDetector(args.video_file, points,
                                      int(start_frame))
            detector.detect_motion()


def parse_args():
    parser = argparse.ArgumentParser(description="Generates Coordinates File")

    parser.add_argument(
        "--image",
        dest="image_file",
        required=False,
        help="Image file to generate coordinates on",
    )

    parser.add_argument(
        "--video",
        dest="video_file",
        required=True,
        help="Video file to detect motion on",
    )

    parser.add_argument(
        "--data",
        dest="data_file",
        required=True,
        help="Data file to be used with OpenCV",
    )

    parser.add_argument(
        "--start-frame",
        dest="start_frame",
        required=False,
        default=1,
        help="Starting frame on the video",
    )

    return parser.parse_args()


if __name__ == "__main__":
    main()
