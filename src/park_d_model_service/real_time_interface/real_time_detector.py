import cv2
import os
import numpy as np
import io
import time


cap = cv2.VideoCapture(1)
print(cap.isOpened())
kernel = np.ones((3, 3), np.uint8)

min_width = 200
max_width = 500
threshold_detection = 4000

def auto_canny(image, sigma=0.33):
    # compute the median of the single channel pixel intensities
    v = np.median(image)

    # apply automatic Canny edge detection using the computed median
    # In practice, sigma=0.33  tends to give good results on most of the dataset
    lower = int(max(0, (1.0 - sigma) * v))
    upper = int(min(255, (1.0 + sigma) * v))
    edged = cv2.Canny(image, lower, upper)

    # return the edged image
    return edged

while True:
    ret, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # For canny detection, translate the frame to grayscale
    # then detect the status of occupancy
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    canny = auto_canny(blurred)

    # For finding the rectangle, only want the rect color
    lower_gray = np.array([0, 0, 0])
    upper_gray = np.array([179, 255, 154])
    mask = cv2.inRange(hsv, lower_gray, upper_gray)

    # Do Morphological Transformations
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    # 6th parameter = the bigger the number is, the more brighter
    # TODO CHANGE VALUE 15 12, 115 1, 113, 3, adaptive method, thresh_binary_inv
    mask = cv2.adaptiveThreshold(mask, 255, cv2.ADAPTIVE_THRESH_MEAN_C
                                 , cv2.THRESH_BINARY, 15, 4)

    # find contours
    contours, hierarchy  = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    hull = [cv2.convexHull(c) for c in contours]

    # sort the contours
    hull.sort(key=lambda x: cv2.boundingRect(x)[0])
    number_box = 1

    # The real detection of parking spaces starts here
    for contour in hull:
        # For debugging purpose
        # cv2.drawContours(frame, contour, -1, (0, 255, 0), 3)
        approx = cv2.approxPolyDP(contour, 0.01 * cv2.arcLength(contour, True), True)

        # if it is square
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(contour)

            # TODO change the width value depending on camera position
            if w > min_width and w < max_width:
                # Debugging for the rect width
                # print("Width: ", w)
                # cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # extract the Region of Interest of canny
                roi = canny[y: y + h, x: x + w]
                cv2.putText(frame, str(number_box), cv2.boundingRect(contour[0])[:2],
                            cv2.FONT_HERSHEY_SIMPLEX, 1, [0,0,255], 3)

                # calculate how many non black pixel in the ROI
                roi_value = cv2.countNonZero(roi)

                # For debugging
                # print how many of non black pixel and show the ROI
                # print("ROI Canny value: ", roi_value)
                # cv2.imshow('roi', roi)

                # check got car park or not
                if roi_value > threshold_detection:
                    # print(str(number_box) + " got parked car")
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
                    print("spot detected!")

                    # cloud vision api executes
                    cv2.imwrite("parking_car.jpg", frame)
                    # print("Parked Car Plate Number : ", car_plate_number)

                #     if car_plate_number is not None:
                #         conn = pymysql.connect(host=host, user=user, password=pw, db=db)
                #         if conn.open:
                #             cursor = conn.cursor()
                #
                #             # check the user is registered or not
                #             select_sql = "SELECT UID FROM car_plate_numbers WHERE plate_number = (%s)"
                #             cursor.execute(select_sql, car_plate_number)
                #             # print("Retrieve UID with match plate number : ", cursor.rowcount)
                #
                #             # if the car plate number is registered
                #             if cursor.rowcount is not 0:
                #                 results = cursor.fetchone()
                #                 UID = results[0]
                #                 # print("UID: ", UID)
                #
                #                 update_sql = "UPDATE parking_spaces SET plate_number = (%s), UID = (%s), status = 1 WHERE space = (%s)"
                #                 cursor.execute(update_sql, (car_plate_number, UID, number_box))
                #                 conn.commit()
                #                 print("Updated parking space status")
                #         else:
                #             print("Connection with db is not open")
                # else:
                #     conn = pymysql.connect(host=host, user=user, password=pw, db=db)
                #     if conn.open:
                #         cursor = conn.cursor()
                #         update_sql = "UPDATE parking_spaces SET plate_number = NULL, UID = NULL, status = 0 WHERE space = (%s)"
                #         cursor.execute(update_sql, number_box)
                #         conn.commit()
                #     else:
                #         print("Connection with db is not open")

                    # For debugging purpose
                    print(str(number_box) + " has car")
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                number_box += 1

    # cv2.imshow('canny', canny)
    cv2.imshow('Mask', mask)
    cv2.imshow('Final Outcome', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
