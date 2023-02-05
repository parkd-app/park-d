import cv2
import os
import logging


def save_frame_sec(video_path, sec, result_path):
    logger = logging.getLogger('werkzeug')
    handler = logging.FileHandler('access.log')
    logger.addHandler(handler)
    cap = cv2.VideoCapture(video_path)
    logging.info("not opend")

    if not cap.isOpened():
        logging.info("not opend")
        return

    os.makedirs(os.path.dirname(result_path), exist_ok=True)

    fps = cap.get(cv2.CAP_PROP_FPS)

    cap.set(cv2.CAP_PROP_POS_FRAMES, round(fps * sec))

    ret, frame = cap.read()
    result_path = result_path + '\\bird.png'
    if ret:
        logging.info("write to path")
        cv2.imwrite(result_path, frame)
    return True
