from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class BusinessProject(models.Model):
    """A paid/owned build tracked through delivery (PRD: Project Management)."""

    class Status(models.TextChoices):
        PLANNING = 'planning', 'Planning'
        IN_PROGRESS = 'in_progress', 'In Progress'
        REVIEW = 'review', 'Review'
        COMPLETED = 'completed', 'Completed'
        ARCHIVED = 'archived', 'Archived'

    class Branch(models.TextChoices):
        WEBDEV = 'webdev', 'IamFit Web Development'
        GAMEDEV = 'gamedev', 'IamFit GameDev'
        STORE = 'store', 'IamFit Store'
        LABS = 'labs', 'IamFit Labs'
        OTHER = 'other', 'Other'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='business_projects'
    )
    client = models.ForeignKey(
        'crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='business_projects'
    )
    name = models.CharField(max_length=200)
    branch = models.CharField(max_length=20, choices=Branch.choices, default=Branch.WEBDEV)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNING)
    deadline = models.DateField(null=True, blank=True)
    contract_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    progress = models.PositiveSmallIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    demo_url = models.URLField(blank=True)
    repo_url = models.URLField(blank=True)
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
        return self.name
