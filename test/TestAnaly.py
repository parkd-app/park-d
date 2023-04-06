import unittest
from Parking_stat import commit_analytics_change,test_data

import firebase_query


class TestAnalyticsData(unittest.TestCase):
    def setUp(self):
        firebase_query.start_db()
    def test_set_hourly_data(self):
        self.assertTrue(firebase_query.set_by_key("analytics", {}))

    def test_set_commit_data(self):
        prev_result = firebase_query.query_by_key("analytics")
        self.assertEqual(commit_analytics_change(test_data()), prev_result['data'].append(test_data()))






