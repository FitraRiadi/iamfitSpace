from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from config.api import OwnerViewSet
from .models import Client, Lead, LeadStatusLog
from .serializers import ClientSerializer, LeadSerializer, LeadStatusLogSerializer


class ClientViewSet(OwnerViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filterset_fields = ['company']
    search_fields = ['name', 'company', 'email', 'contact']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']


class LeadViewSet(OwnerViewSet):
    queryset = Lead.objects.select_related('client').all()
    serializer_class = LeadSerializer
    filterset_fields = ['status', 'client', 'follow_up_date']
    search_fields = ['title', 'contact', 'notes']
    ordering_fields = ['value_estimate', 'follow_up_date', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()
        if old_status != instance.status:
            LeadStatusLog.objects.create(
                lead=instance,
                from_status=old_status,
                to_status=instance.status,
                changed_by=self.request.user,
            )


class LeadStatusLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeadStatusLogSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['lead', 'to_status']
    ordering = ['-created_at']

    def get_queryset(self):
        return LeadStatusLog.objects.filter(lead__owner=self.request.user).select_related('lead')
