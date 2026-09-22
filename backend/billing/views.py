from datetime import date

from django.db import transaction as db_transaction
from django.db.models import Q, Sum
from django.db.models.functions import TruncMonth
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from config.api import OwnerViewSet
from .models import Invoice, Transaction
from .serializers import InvoiceSerializer, TransactionSerializer


class InvoiceViewSet(OwnerViewSet):
    queryset = Invoice.objects.select_related('client', 'project').all()
    serializer_class = InvoiceSerializer
    filterset_fields = ['status', 'client', 'project']
    search_fields = ['number', 'notes', 'client__name']
    ordering_fields = ['amount', 'due_date', 'created_at']
    ordering = ['-created_at']


class TransactionViewSet(OwnerViewSet):
    queryset = Transaction.objects.select_related('invoice', 'project', 'lead').all()
    serializer_class = TransactionSerializer
    filterset_fields = ['kind', 'category', 'invoice', 'project', 'lead', 'occurred_on']
    search_fields = ['title', 'category', 'notes']
    ordering_fields = ['amount', 'occurred_on', 'created_at']
    ordering = ['-occurred_on', '-created_at']

    def perform_create(self, serializer):
        auto = serializer.validated_data.pop('auto_invoice', False)
        inv_client_id = serializer.validated_data.pop('invoice_client', None)
        inv_due = serializer.validated_data.pop('invoice_due_date', None)
        with db_transaction.atomic():
            instance = serializer.save(owner=self.request.user)
            if auto and instance.kind == Transaction.Kind.INCOME:
                client = self._resolve_invoice_client(instance, inv_client_id)
                if client is None:
                    raise DRFValidationError(
                        {'invoice_client': 'Client is required for auto invoice.'}
                    )
                inv = Invoice.objects.create(
                    owner=self.request.user,
                    client=client,
                    project=instance.project,
                    number='TEMP',
                    amount=instance.amount,
                    status=Invoice.Status.DRAFT,
                    due_date=inv_due or instance.occurred_on,
                )
                # Number needs the PK: INV-YYYY/MM/DD-{id} (unique by id suffix).
                inv.number = f"INV-{instance.occurred_on:%Y/%m/%d}-{inv.id}"
                inv.save(update_fields=['number'])
                instance.invoice = inv
                instance.save(update_fields=['invoice'])

    def _resolve_invoice_client(self, txn, client_id):
        from crm.models import Client

        if client_id:
            try:
                return Client.objects.get(pk=client_id, owner=self.request.user)
            except Client.DoesNotExist:
                raise DRFValidationError({'invoice_client': 'Client not found.'})
        if txn.lead_id and txn.lead.client_id:
            return txn.lead.client
        if txn.project_id and txn.project.client_id:
            return txn.project.client
        return None


class FinancialSummaryView(APIView):
    """Dashboard overview numbers: income, expense, profit, outstanding."""

    def get(self, request):
        txns = Transaction.objects.filter(owner=request.user)
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        if year:
            txns = txns.filter(occurred_on__year=year)
        if month:
            txns = txns.filter(occurred_on__month=month)

        income = txns.filter(kind=Transaction.Kind.INCOME).aggregate(total=Sum('amount'))['total'] or 0
        expense = txns.filter(kind=Transaction.Kind.EXPENSE).aggregate(total=Sum('amount'))['total'] or 0
        outstanding = (
            Invoice.objects.filter(
                owner=request.user,
                status__in=[Invoice.Status.SENT, Invoice.Status.OVERDUE],
            ).aggregate(total=Sum('amount'))['total']
            or 0
        )
        return Response(
            {
                'income': income,
                'expense': expense,
                'profit': income - expense,
                'outstanding': outstanding,
                'transaction_count': txns.count(),
            }
        )


class MonthlyFinanceView(APIView):
    """Per-month buckets for charts: ?months=12 (1..24, default 12).

    Response: [{ month: 'YYYY-MM-01', income, expense, invoiced }]
    Only months with activity are returned — the client fills the gaps.
    """

    def get(self, request):
        try:
            months = min(max(int(request.query_params.get('months', 12)), 1), 24)
        except (TypeError, ValueError):
            months = 12

        today = date.today()
        first = date(today.year, today.month, 1)
        # Walk back (months - 1) to the window start.
        start_year, start_month = first.year, first.month
        for _ in range(months - 1):
            if start_month == 1:
                start_year -= 1
                start_month = 12
            else:
                start_month -= 1
        start = date(start_year, start_month, 1)

        txn_rows = (
            Transaction.objects.filter(owner=request.user, occurred_on__gte=start)
            .annotate(month=TruncMonth('occurred_on'))
            .values('month', 'kind')
            .annotate(total=Sum('amount'))
        )
        inv_rows = (
            Invoice.objects.filter(owner=request.user, created_at__date__gte=start)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('amount'))
        )

        buckets = {}
        for r in txn_rows:
            key = r['month'].strftime('%Y-%m-01')
            buckets.setdefault(key, {'income': 0.0, 'expense': 0.0, 'invoiced': 0.0})
            buckets[key][r['kind']] = float(r['total'] or 0)
        for r in inv_rows:
            key = r['month'].strftime('%Y-%m-01')
            buckets.setdefault(key, {'income': 0.0, 'expense': 0.0, 'invoiced': 0.0})
            buckets[key]['invoiced'] = float(r['total'] or 0)

        return Response(
            [{'month': k, **v} for k, v in sorted(buckets.items())]
        )
