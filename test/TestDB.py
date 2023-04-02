import unittest
import firebase_query
import save_coord_service



TestUrl = "https://www.youtube.com/watch?v=iq-CT8UQzgo&ab_channel=BrightonResort"
TestObject = {
  "parking_spaces": [
    {
      "id": 0,
      "coordinates": [
        [
          44,
          355
        ],
        [
          66,
          398
        ],
        [
          151,
          380
        ],
        [
          94,
          344
        ]
      ],
      "corners": [
        [
          43.88980301725122,
          -79.3143506910343
        ],
        [
          43.88977901725123,
          -79.31434069108282
        ],
        [
          43.889794017251205,
          -79.31427269141277
        ],
        [
          43.88981801725124,
          -79.31428069137395
        ]
      ],
      "open": true
    },
    {
      "id": 1,
      "coordinates": [
        [
          157,
          377
        ],
        [
          212,
          359
        ],
        [
          158,
          329
        ],
        [
          107,
          349
        ]
      ],
      "corners": [
        [
          43.88982621320785,
          -79.31436141990228
        ],
        [
          43.889802213207844,
          -79.31435141994693
        ],
        [
          43.8898172132078,
          -79.31428342025036
        ],
        [
          43.88984121320786,
          -79.31429142021466
        ]
      ],
      "open": false
    }]}

class TestUploadingData(unittest.TestCase):
    def setUp(self):
        firebase_query.start_db()
    def test_set_by_key_string(self):
        self.assertTrue(firebase_query.set_by_key("parking_info", testUrl))
        self.assertEqual(firebase_query.query_by_key("parking_info"),TestUrl)

    def test_set_by_key_object(self):
        self.assertTrue(firebase_query.set_by_key("parking_lot_layout", TestObject))
        self.assertEqual(firebase_query.query_by_key("parking_lot_layout"), TestObject)

    def test_create_key(selfs):
      self.assertEqual(save_coord_service.create_unique_key("Gary",1), Gary + "_parking_1_info")




