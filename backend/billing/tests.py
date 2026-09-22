from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Invoice, Transaction

User = get_user_model()


class MonthlyFinanceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fit', password='pw123456')
        self.client.force_authenticate(self.user)

    def test_buckets_group_by_month(self):
        today = date.today()
        last_month = (today.replace(day=1) - timedelta(days=1)).replace(day=15)
        Transaction.objects.create(
            owner=self.user, kind='income', category='Web', amount=1000,
            occurred_on=today.replace(day=2),
        )
        Transaction.objects.create(
            owner=self.user, kind='expense', category='Hosting', amount=200,
            occurred_on=last_month,
        )
        res = self.client.get('/api/finance/monthly/', {'months': 3})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        by_month = {r['month']: r for r in res.data}
        this_key = today.strftime('%Y-%m-01')
        last_key = last_month.strftime('%Y-%m-01')
        self.assertEqual(float(by_month[this_key]['income']), 1000.0)
        self.assertEqual(float(by_month[last_key]['expense']), 200.0)

    def test_owner_isolation(self):
        other = User.objects.create_user(username='stranger', password='pw123456')
        Transaction.objects.create(
            owner=other, kind='income', category='Web', amount=9999,
            occurred_on=date.today(),
        )
        res = self.client.get('/api/finance/monthly/')
        totals = [r['income'] for r in res.data]
        self.assertNotIn(9999.0, totals)

    def test_anonymous_blocked(self):
        self.client.force_authenticate(None)
        res = self.client.get('/api/finance/monthly/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invoice_counts_as_billed(self):
        from crm.models import Client

        client = Client.objects.create(owner=self.user, name='Acme')
        Invoice.objects.create(
            owner=self.user, client=client, number='INV-9', amount=5000, status='sent'
        )
        res = self.client.get('/api/finance/monthly/')
        key = date.today().strftime('%Y-%m-01')
        by_month = {r['month']: r for r in res.data}
        self.assertEqual(float(by_month[key]['invoiced']), 5000.0)

    def test_income_linked_to_won_lead(self):
        from crm.models import Lead

        lead = Lead.objects.create(
            owner=self.user, title='Big deal', status='won', value_estimate=7500000
        )
        res = self.client.post(
            '/api/transactions/',
            {
                'kind': 'income',
                'title': 'Big deal',
                'category': 'Website Development',
                'amount': '7500000',
                'occurred_on': str(date.today()),
                'lead': lead.pk,
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['lead'], lead.pk)
        self.assertEqual(res.data['lead_title'], 'Big deal')
        self.assertEqual(res.data['title'], 'Big deal')

    def test_auto_invoice_creates_numbered_invoice(self):
        from crm.models import Client, Lead

        client = Client.objects.create(owner=self.user, name='Acme')
        lead = Lead.objects.create(
            owner=self.user, client=client, title='Big deal',
            status='won', value_estimate=7500000,
        )
        res = self.client.post(
            '/api/transactions/',
            {
                'kind': 'income',
                'title': 'Big deal',
                'category': 'Website Development',
                'amount': '7500000',
                'occurred_on': str(date.today()),
                'lead': lead.pk,
                'auto_invoice': True,
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        inv_id = res.data['invoice']
        self.assertIsNotNone(inv_id)
        inv = Invoice.objects.get(pk=inv_id)
        today = date.today()
        self.assertEqual(inv.number, f'INV-{today:%Y/%m/%d}-{inv.id}')
        self.assertEqual(inv.status, 'draft')
        self.assertEqual(inv.client_id, client.pk)
        self.assertEqual(res.data['invoice_number'], inv.number)

    def test_auto_invoice_needs_client(self):
        res = self.client.post(
            '/api/transactions/',
            {
                'kind': 'income',
                'title': 'Mystery money',
                'category': 'Other Services',
                'amount': '1000',
                'occurred_on': str(date.today()),
                'auto_invoice': True,
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
