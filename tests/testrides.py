
import json
import unittest

from application import app_config


class UserTests(unittest.TestCase):

    def setUp(self):
        """Prepare testing environment """

        self.app = app_config('testing')
        self.app.config.from_object(configuration['testing'])
        self.app = self.app.test_client()

    def tearDown(self):
        """Release flask app instance"""
        self.app = None

    def test_get_all_rides(self):
        """test user can get available rides"""
        response = self.app.get('/api/v1/rides',
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
