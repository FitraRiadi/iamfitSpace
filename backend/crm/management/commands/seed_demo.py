from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from billing.models import Invoice, Transaction
from catalog.models import Product, ProductCategory
from crm.models import Client, Lead
from projects.models import BusinessProject

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo dashboard data for a user (dev only).'

    def add_arguments(self, parser):
        parser.add_argument('--username', default='fitra')
        parser.add_argument('--reset', action='store_true', help='Wipe existing demo data first.')

    def handle(self, *args, **options):
        username = options['username']
        user, _ = User.objects.get_or_create(
            username=username, defaults={'email': f'{username}@iamfit.space'}
        )

        if options['reset']:
            Transaction.objects.filter(owner=user).delete()
            Invoice.objects.filter(owner=user).delete()
            BusinessProject.objects.filter(owner=user).delete()
            Lead.objects.filter(owner=user).delete()
            Client.objects.filter(owner=user).delete()
            Product.objects.filter(owner=user).delete()
            ProductCategory.objects.filter(owner=user).delete()

        if Client.objects.filter(owner=user).exists():
            self.stdout.write(self.style.WARNING('Demo data already exists — pass --reset to reseed.'))
            return

        c1 = Client.objects.create(owner=user, name='Apex Labs', contact='Satoshi', email='satoshi@apex.dev', company='Apex Labs')
        c2 = Client.objects.create(owner=user, name='SMK Merdeka', contact='Pak Dadan', email='info@smkmerdeka.sch.id', company='SMK Merdeka Bandung')
        c3 = Client.objects.create(owner=user, name='Kedai Kopi Nako', contact='Riko', company='Nako Group')

        Lead.objects.create(owner=user, client=c1, title='Company profile + CMS', contact='Satoshi', value_estimate=4500000, status=Lead.Status.NEGOTIATION, follow_up_date=date.today() + timedelta(days=2))
        Lead.objects.create(owner=user, title='POS kasir kopi', contact='Riko', value_estimate=2800000, status=Lead.Status.DISCUSSION)
        Lead.objects.create(owner=user, title='Landing page event', value_estimate=1200000, status=Lead.Status.NEW)
        Lead.objects.create(owner=user, title='Maintenance blog', value_estimate=800000, status=Lead.Status.CONTACTED)
        Lead.objects.create(owner=user, title='Kuis online', value_estimate=0, status=Lead.Status.LOST)

        p1 = BusinessProject.objects.create(owner=user, client=c1, name='Apex Company Portal', branch='webdev', status='in_progress', contract_value=8500000, progress=60, deadline=date.today() + timedelta(days=21))
        BusinessProject.objects.create(owner=user, client=c2, name='OSB — Online School Book', branch='webdev', status='in_progress', contract_value=12000000, progress=80)
        BusinessProject.objects.create(owner=user, name='Knight Battle', branch='gamedev', status='review', contract_value=0, progress=60)

        inv = Invoice.objects.create(owner=user, client=c1, project=p1, number='INV-2026-001', amount=4250000, status='sent', due_date=date.today() + timedelta(days=14))
        Transaction.objects.create(owner=user, kind='income', category='Website Development', amount=4250000, occurred_on=date.today() - timedelta(days=6), project=p1)
        Transaction.objects.create(owner=user, kind='expense', category='Hosting', amount=250000, occurred_on=date.today() - timedelta(days=3))
        Transaction.objects.create(owner=user, kind='expense', category='Domain', amount=180000, occurred_on=date.today() - timedelta(days=1))

        cat = ProductCategory.objects.create(owner=user, name='Source Code', slug='source-code')
        Product.objects.create(owner=user, category=cat, name='React Admin Starter', slug='react-admin-starter', short_description='Production admin boilerplate.', price=149000, status='published', version='1.2.0')

        self.stdout.write(self.style.SUCCESS(f'Seeded demo data for {username} (invoice {inv.number}).'))
