from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Client, Lead, LeadStatusLog

User = get_user_model()


class AuthGuardTests(APITestCase):
    def test_anonymous_cannot_list_clients(self):
        res = self.client.get('/api/clients/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class ClientTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fit', password='pw123456')
        self.client.force_authenticate(self.user)

    def test_create_and_list_client(self):
        res = self.client.post('/api/clients/', {'name': 'Acme', 'email': 'hi@acme.co'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        res = self.client.get('/api/clients/')
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['results'][0]['name'], 'Acme')

    def test_owner_isolation(self):
        other = User.objects.create_user(username='stranger', password='pw123456')
        Client.objects.create(owner=other, name='Hidden Co')
        res = self.client.get('/api/clients/')
        self.assertEqual(res.data['count'], 0)

        hidden = Client.objects.get(name='Hidden Co')
        res = self.client.get(f'/api/clients/{hidden.pk}/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)


class LeadPipelineTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fit', password='pw123456')
        self.client.force_authenticate(self.user)

    def test_status_move_writes_log(self):
        lead = Lead.objects.create(owner=self.user, title='Big deal')
        res = self.client.patch(f'/api/leads/{lead.pk}/', {'status': 'negotiation'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'negotiation')
        self.assertEqual(LeadStatusLog.objects.filter(lead=lead).count(), 1)
        log = LeadStatusLog.objects.get(lead=lead)
        self.assertEqual((log.from_status, log.to_status), ('new', 'negotiation'))

    def test_same_status_move_writes_no_log(self):
        lead = Lead.objects.create(owner=self.user, title='Steady', status='contacted')
        self.client.patch(f'/api/leads/{lead.pk}/', {'notes': 'called twice'}, format='json')
        self.assertEqual(LeadStatusLog.objects.filter(lead=lead).count(), 0)


class ClientDeleteGuardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fit', password='pw123456')
        self.client.force_authenticate(self.user)

    def test_delete_client_with_invoice_returns_409(self):
        from billing.models import Invoice

        client = Client.objects.create(owner=self.user, name='Big Co')
        Invoice.objects.create(owner=self.user, client=client, number='INV-1', amount=1000)
        res = self.client.delete(f'/api/clients/{client.pk}/')
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)
        self.assertTrue(Client.objects.filter(pk=client.pk).exists())

    def test_delete_clean_client_works(self):
        client = Client.objects.create(owner=self.user, name='Solo')
        res = self.client.delete(f'/api/clients/{client.pk}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
