from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import FinancialSummaryView, InvoiceViewSet, MonthlyFinanceView, TransactionViewSet

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('finance/summary/', FinancialSummaryView.as_view(), name='finance-summary'),
    path('finance/monthly/', MonthlyFinanceView.as_view(), name='finance-monthly'),
] + router.urls
