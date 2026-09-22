from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
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
    amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(1)])
    discount_percent = models.PositiveSmallIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    due_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    # Deals billed on this invoice (many-to-many: one invoice can bundle
    # several won deals; one deal can be billed across several invoices,
    # e.g. DP + pelunasan). Powers receipt lines + double-billing hints.
    leads = models.ManyToManyField(
        'crm.Lead', blank=True, related_name='invoices'
    )
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
    title = models.CharField(max_length=200, blank=True, default='')
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    occurred_on = models.DateField()
    lead = models.ForeignKey(
        'crm.Lead',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
    )
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
        return f'{self.get_kind_display()} {self.amount} ({self.title or self.category})'


class InvoiceItem(models.Model):
    """Manual line on an invoice: extra services/fees beside linked deals."""

    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name='items'
    )
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(1)])
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return f'{self.description} — {self.amount}'
