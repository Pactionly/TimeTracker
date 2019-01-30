"""Defines Tests For myapp"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class IndexViewTests(TestCase):
    """ Tests for index """
    def setUp(self):
        """ Setup run before tests """
        get_user_model().objects.create_user('temp', 'temp@gmail.com', 'temp')

    def test_page_redirect_no_login(self):
        """ If not logged in, page should redirect """
        response = self.client.get('/')
        self.assertEqual(response.status_code, 302)

    def test_page_load_with_login(self):
        """ If logged in, page should load properly """
        self.client.login(username='temp', password='temp')
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

class ProfileViewTests(TestCase):
    """ Tests for /profile/ """
    def setUp(self):
        """ Setup Run Before Tests """
        get_user_model().objects.create_user('temp', 'temp@gmail.com', 'temp')

    def test_page_redirect_no_login(self):
        """ If not logged in page should redirect """
        response = self.client.get('/profile/')
        self.assertEqual(response.status_code, 302)

    def test_page_load_with_login(self):
        """ If logged in page should load properly """
        self.client.login(username='temp', password='temp')
        response = self.client.get('/profile/')
        self.assertEqual(response.status_code, 200)

class WorkStatsViewTests(TestCase):
    """ Tests For /work_stats/ """
    def setUp(self):
        """Setup Run Before Tests"""
        get_user_model().objects.create_user('temp', 'temp@gmail.com', 'temp')

    def test_page_redirect_no_login(self):
        """ If not logged in page should redirect """
        response = self.client.get('/work_stats/')
        self.assertEqual(response.status_code, 302)

    def test_page_load_with_login(self):
        """ If logged in page should load properly """
        self.client.login(username='temp', password='temp')
        response = self.client.get('/work_stats/')
        self.assertEqual(response.status_code, 200)


class ClockInViewTests(TestCase):
    """ Tests For /clock_in/ """
    def setUp(self):
        """Setup Run Before Tests"""
        get_user_model().objects.create_user('temp', 'temp@gmail.com', 'temp')

    def test_page_redirect_no_login(self):
        """ If not logged in page should redirect """
        response = self.client.get('/clock_in/')
        self.assertEqual(response.status_code, 302)

    def test_page_error_with_get_request(self):
        """ Get Requests should be invalid for this page """
        self.client.login(username='temp', password='temp')
        response = self.client.get('/clock_in/')
        self.assertEqual(response.status_code, 400)

    def test_page_updates_clock_in_with_post(self):
        """ Page should update database model on post request """
        self.client.login(username='temp', password='temp')
        response = self.client.post('/clock_in/', {})
        clock_in_time = User.objects.get(username='temp').profile.clock_in_time
        self.assertEqual(response.status_code, 302)
        self.assertTrue(clock_in_time is not None)
