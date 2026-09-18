from django.conf import settings
from django.db import models


class Client(models.Model):
    """A web-dev client (PRD: Client Management)."""

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clients'
    )
    name = models.CharField(max_length=200)
    contact = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    company = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['owner', '-created_at'])]

    def __str__(self):
        return self.name


class Lead(models.Model):
    """Prospective client moving through the sales pipeline (PRD: Lead Pipeline)."""

    class Status(models.TextChoices):
        NEW = 'new', 'New Lead'
        CONTACTED = 'contacted', 'Contacted'
        DISCUSSION = 'discussion', 'Discussion'
        PROPOSAL_SENT = 'proposal_sent', 'Proposal Sent'
        NEGOTIATION = 'negotiation', 'Negotiation'
        WON = 'won', 'Won'
        LOST = 'lost', 'Lost'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leads'
    )
    client = models.ForeignKey(
        Client, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads'
    )
    title = models.CharField(max_length=200)
    contact = models.CharField(max_length=200, blank=True)
    value_estimate = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    follow_up_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'status']),
            models.Index(fields=['owner', '-created_at']),
        ]

    def __str__(self):
        return f'{self.title} [{self.get_status_display()}]'


class LeadStatusLog(models.Model):
    """Append-only history of pipeline moves (PRD: status change history)."""

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='status_logs')
    from_status = models.CharField(max_length=20, blank=True)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.lead_id}: {self.from_status or "-"} -> {self.to_status}'
