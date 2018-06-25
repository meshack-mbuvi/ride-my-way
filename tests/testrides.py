
import json
import unittest


class UserTests(unittest.TestCase):

    def setUp(self):
        """Prepare testing environment """

        self.app = app_config('testing')
        self.app.config.from_object(configuration['testing'])
        self.app = self.app.test_client()

    def tearDown(self):
        """Release flask app instance"""
        self.app = None

    def test_create_ride(self):
        """test user can get available rides"""
        ride = {
            "route": "Thika-Nairobi",
            "start point": "Witeithye",
            "destination": "Ngara",
            "start time": "7.00 am",
            "charges": "5 kshs/km",
            "capacity": 10,
            "notes": "space for large cargo not available"
        }
        response = self.app.post('/api/v1/rides',
                                 data=json.dumps(ride),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_cannot_create_ride_with_negative_time(self):
        ride = {
            "route": "Thika-Nairobi",
            "start point": "Witeithye",
            "destination": "Ngara",
            "start time": "-7.00 am",
            "charges": "5 kshs/km",
            "capacity": 10,
            "notes": "space for large cargo not available"
        }
        response = self.app.post('/api/v1/rides',
                                 data=json.dumps(ride),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_destination_or_route_starts_with_strings(self):
        ride = {
            "route": "Thika-Nairobi",
            "start point": "Witeithye",
            "destination": "45Ngara",
            "start time": "7.00 am",
            "charges": "5 kshs/km",
            "capacity": 10,
            "notes": "space for large cargo not available"
        }
        response = self.app.post('/api/v1/rides',
                                 data=json.dumps(ride),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_cannot_create_ride_without_details(self):
        ride = {}
        response = self.app.post('/api/v1/rides',
                                 data=json.dumps(ride),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_capacity_can_be_numbers_only(self):
        ride = {
            "route": "Thika-Nairobi",
            "start point": "Witeithye",
            "destination": "Ngara",
            "start time": "7.00 am",
            "charges": "5 kshs/km",
            "capacity": 'ten',
            "notes": "space for large cargo not available"
        }
        response = self.app.post('/api/v1/rides',
                                 data=json.dumps(ride),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_all_rides(self):
        """test user can get available ride offers"""
        response = self.app.get('/api/v1/rides',
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_get_a_ride(self):
        """test user can get a single ride offer"""
        response = self.app.get('/api/v1/rides/1',
                                content_type='application/json')
        self.assertEqual(response.status_code, 200,
                         message="Should retrieve all ride offers")
        response_data = json.loads(response.get_data().decode('utf-8'))
        self.assertEqual(len(response_data), 1)

    def test_get_ride_not_existing(self):
        """Assumes no ride with a negative id number"""
        response = self.app.get('/api/v1/rides/-1',
                                content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.get_data().decode('utf-8'))
        self.assertEqual(len(response_data), 0)

    def test_post_join_ride(self):
        """test user can get available rides"""
        response = self.app.get('/api/v1/rides/1/requests',
                                content_type='application/json')
        """"message":"."""
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.get_data().decode('utf-8'))
        self.assertEqual(response_data['message'],
                         "You requested to join ride offer with id:1")

    def test_post_join_non_existing_ride_fails(self):
        """test user can get available rides"""
        response = self.app.get('/api/v1/rides/-1/requests',
                                content_type='application/json')
        """"message":"."""
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.get_data().decode('utf-8'))
        self.assertEqual(response_data['message'],
                         "Ride offer with id: -1 does not exist")


if __name__ == '__main__':
    unittest.main()
