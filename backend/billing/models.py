from django.conf import settings
from django.db import models


class Invoice(models.Model):
    """Billing document sent to a client (PRD: Financial Management)."""

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        SENT = 'sent', 'Sent'
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        CANCELLED = 'cancelled', 'Cancelled'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices'
    )
    client = models.ForeignKey(
        'crm.Client', on_delete=models.PROTECT, related_name='invoices'
    )
    project = models.ForeignKey(
        'projects.BusinessProject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices',
    )
    number = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    due_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['owner', 'number'], name='uniq_invoice_number_per_owner')
        ]
        indexes = [models.Index(fields=['owner', 'status'])]

    def __str__(self):
        return f'{self.number} — {self.amount}'


class Transaction(models.Model):
    """Single money movement, in or out (PRD: income & expense tracking)."""

    class Kind(models.TextChoices):
        INCOME = 'income', 'Income'
        EXPENSE = 'expense', 'Expense'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions'
    )
    kind = models.CharField(max_length=10, choices=Kind.choices)
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    occurred_on = models.DateField()
    invoice = models.ForeignKey(
        Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions'
    )
    project = models.ForeignKey(
        'projects.BusinessProject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-occurred_on', '-created_at']
        indexes = [
            models.Index(fields=['owner', 'kind']),
            models.Index(fields=['owner', '-occurred_on']),
        ]

    def __str__(self):
        return f'{self.get_kind_display()} {self.amount} ({self.category})'
