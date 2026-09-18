from django.db.models import Q, Sum
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
    queryset = Transaction.objects.select_related('invoice', 'project').all()
    serializer_class = TransactionSerializer
    filterset_fields = ['kind', 'category', 'invoice', 'project', 'occurred_on']
    search_fields = ['category', 'notes']
    ordering_fields = ['amount', 'occurred_on', 'created_at']
    ordering = ['-occurred_on', '-created_at']


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
