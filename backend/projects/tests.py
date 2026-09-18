from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class BusinessProjectTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fit', password='pw123456')
        self.client.force_authenticate(self.user)

    def test_create_project_defaults(self):
        res = self.client.post('/api/projects/', {'name': 'Portal X'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'planning')
        self.assertEqual(res.data['progress'], 0)

    def test_progress_validation(self):
        res = self.client.post('/api/projects/', {'name': 'Bad', 'progress': 150}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
