import coordinate_input_service
import unittest
import firebase_query


TestURL1 = "https://www.youtube.com/watch?v=iq-CT8UQzgo&ab_channel=BrightonResort"
TestURL2 = "https://www.youtube.com/watch?v=c38K8IsYnB0"

coordinate_1 = {
    "parking_lots": {
        "id": 1,
        "owner": "gary_hand_drawn",
        "parking_spaces": [
            {
                "id": 0,
                "status": false,
                "camcoords":[[99,417],[45,531],[150,541],[202,432]],
                "mapcoords": [],
                "type": 0
            },
            {
                "id": 1,
                "status": false,
                "camcoords": [[211,428],[167,542],[294,544],[310,429]],
                "mapcoords": [],
                "type": 0
            },
            {
                "id": 2,
                "status": false,
                "camcoords":[[322,433],[304,545],[444,548],[440,433]],
                "mapcoords": [],
                "type": 1
            },
            {
                "id": 3,
                "status": false,
                "camcoords": [[448,434],[446,541],[576,540],[555,434]],
                "mapcoords": [],
                "type": 0
            },
            {
                "id": 4,
                "status": false,
                "camcoords": [[562,429],[585,538],[728,531],[670,419]],
                "mapcoords": [],
                "type": 0
            }
            ,
            {
                "id": 5,
                "status": false,
                "camcoords": [[686,427],[736,535],[851,515],[790,421]],
                "mapcoords": [],
                "type": 0
            }
            ,
            {
                "id": 6,
                "status": false,
                "camcoords": [[801,423],[854,517],[946,492],[891,411]],
                "mapcoords": [],
                "type": 0
            }
            ,
            {
                "id": 7,
                "status": false,
                "camcoords": [[891,399],[949,481],[1027,468],[962,383]],
                "mapcoords": [],
                "type": 0
            }
        ]
    }
}

class TestUploadingData(unittest.TestCase):
    def setUp(self):
        firebase_query.start_db()
    def test_model_input(self):
        coordinate_input_service.set_current_input(TestURL2)
        self.assertEqual(firebase_query.query_by_key("current_input"), TestURL2)
        coordinate_input_service.set_current_input(TestURL1)
        self.assertEqual(firebase_query.query_by_key("current_input"), TestURL1)
    def test_model_coordinate_input(self):
        coordinate_input_service.set_current_coordinates("Gary_info",1)
        self.assertEqual(firebase_query.query_by_key("current_coordinates"), str(coordinate_1))
        self.assertEqual(firebase_query.query_by_key("Gary_info_parking_lot_1"), str(coordinate_1))