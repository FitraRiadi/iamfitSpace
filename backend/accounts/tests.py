from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class MeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='fit', password='pw123456', first_name='Fitra', last_name='Riadi'
        )
        self.client.force_authenticate(self.user)

    def test_anonymous_blocked(self):
        self.client.force_authenticate(None)
        res = self.client.get('/api/auth/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile(self):
        res = self.client.get('/api/auth/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['full_name'], 'Fitra Riadi')

    def test_patch_profile(self):
        res = self.client.patch(
            '/api/auth/me/',
            {'first_name': 'FitraNew', 'username': 'fitra2'},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'FitraNew')
        self.assertEqual(self.user.username, 'fitra2')

    def test_username_unique(self):
        User.objects.create_user(username='taken', password='pw123456')
        res = self.client.patch('/api/auth/me/', {'username': 'taken'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
