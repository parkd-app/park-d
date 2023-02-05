import cv2
import numpy as np
import pickle
import socket

rectW, rectH = 120, 250


path1 = "train2_bird.mp4"
path2 = "carPark.mp4"
cap = cv2.VideoCapture(path1)

with open("carParkPos", "rb") as f:
    posList = pickle.load(f)
frame_counter = 0


def check(imgPro):
    result_map = []
    spaceCount = 0
    for pos in posList:
        x, y = pos
        crop = imgPro[y : y + rectH, x : x + rectW]
        count = cv2.countNonZero(crop)
        if count < 900:
            spaceCount += 1
            color = (0, 255, 0)
            thick = 5
            result_map.append(True)
        else:
            color = (0, 0, 255)
            thick = 2
            result_map.append(False)

        cv2.rectangle(img, pos, (x + rectW, y + rectH), color, thick)
    with open("parking_info.txt", "w") as file:
        file.write(str(result_map))
    cv2.rectangle(img, (45, 30), (250, 75), (180, 0, 180), -1)
    cv2.putText(
        img,
        f"Free: {spaceCount}/{len(posList)}",
        (50, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.9,
        (255, 255, 255),
        2,
    )


serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(("localhost", 12345))

print("model bird start listening for request")
while serversocket.listen() != -1:
    connection, address = serversocket.accept()
    data = connection.recv(1024)
    if data == "close":
        serversocket.close()
        break
    while cap.isOpened():
        _, img = cap.read()
        if frame_counter == cap.get(cv2.CAP_PROP_FRAME_COUNT):
            frame_counter = 0  # Or whatever as long as it is the same as next line
            cap.set(cv2.cv.CV_CAP_PROP_POS_FRAMES, 0)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (3, 3), 1)
        Thre = cv2.adaptiveThreshold(
            blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 16
        )
        blur = cv2.medianBlur(Thre, 5)
        kernel = np.ones((3, 3), np.uint8)
        dilate = cv2.dilate(blur, kernel, iterations=1)

        check(dilate)

        cv2.imshow("Image", img)
        k = cv2.waitKey(1)
        if k == ord("q"):
            break
cap.release()
cv2.destroyAllWindows()
