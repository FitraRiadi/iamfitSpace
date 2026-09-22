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
        self.assertEqual(inv.status, 'paid')
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

    def test_invoice_links_multiple_deals(self):
        from crm.models import Client, Lead

        client = Client.objects.create(owner=self.user, name='Acme')
        l1 = Lead.objects.create(owner=self.user, client=client, title='Web', status='won', value_estimate=4000)
        l2 = Lead.objects.create(owner=self.user, client=client, title='Care', status='won', value_estimate=2000)
        res = self.client.post(
            '/api/invoices/',
            {
                'number': 'INV-MULTI', 'client': client.pk, 'amount': '6000',
                'status': 'sent', 'leads': [l1.pk, l2.pk],
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        inv = Invoice.objects.get(number='INV-MULTI')
        self.assertEqual(set(inv.leads.values_list('pk', flat=True)), {l1.pk, l2.pk})
        res = self.client.get(f'/api/invoices/{inv.pk}/')
        self.assertEqual(len(res.data['deal_lines']), 2)

    def test_invoice_rejects_foreign_deal(self):
        from crm.models import Client, Lead

        other = User.objects.create_user(username='stranger', password='pw123456')
        foreign = Lead.objects.create(owner=other, title='Theirs', status='won')
        client = Client.objects.create(owner=self.user, name='Acme')
        res = self.client.post(
            '/api/invoices/',
            {
                'number': 'INV-X', 'client': client.pk, 'amount': '100',
                'leads': [foreign.pk],
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invoice_number_auto_generated(self):
        from crm.models import Client

        client = Client.objects.create(owner=self.user, name='Acme')
        res = self.client.post(
            '/api/invoices/',
            {'client': client.pk, 'amount': '2500', 'status': 'draft'},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        inv = Invoice.objects.get(pk=res.data['id'])
        today = date.today()
        self.assertEqual(inv.number, f'INV-{today:%Y/%m/%d}-{inv.id}')
        self.assertEqual(res.data['number'], inv.number)

    def test_invoice_discount_bounds(self):
        from crm.models import Client

        client = Client.objects.create(owner=self.user, name='Acme')
        res = self.client.post(
            '/api/invoices/',
            {'client': client.pk, 'amount': '1000', 'discount_percent': 150},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        res = self.client.post(
            '/api/invoices/',
            {'client': client.pk, 'amount': '1000', 'discount_percent': 10},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['discount_percent'], 10)

    def test_invoice_amount_must_be_positive(self):
        from crm.models import Client

        client = Client.objects.create(owner=self.user, name='Acme')
        res = self.client.post(
            '/api/invoices/',
            {'client': client.pk, 'amount': '0'},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invoice_custom_items_roundtrip(self):
        from crm.models import Client

        client = Client.objects.create(owner=self.user, name='Acme')
        res = self.client.post(
            '/api/invoices/',
            {
                'client': client.pk, 'amount': '7000',
                'items': [
                    {'description': 'Extra revision', 'amount': '5000'},
                    {'description': 'Domain fee', 'amount': '2000'},
                ],
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(res.data['items']), 2)
        inv_id = res.data['id']
        # Replace-all on update.
        res = self.client.patch(
            f'/api/invoices/{inv_id}/',
            {'items': [{'description': 'Only this', 'amount': '3000'}]},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.get(f'/api/invoices/{inv_id}/')
        self.assertEqual(len(res.data['items']), 1)
        self.assertEqual(res.data['items'][0]['description'], 'Only this')
