from rest_framework import serializers

from .models import Client, Lead, LeadStatusLog


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'name', 'contact', 'email', 'company', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeadSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'title', 'contact', 'client', 'client_name',
            'value_estimate', 'status', 'status_display',
            'follow_up_date', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeadStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadStatusLog
        fields = ['id', 'lead', 'from_status', 'to_status', 'changed_by', 'note', 'created_at']
        read_only_fields = fields
