from rest_framework import serializers

from .models import BusinessProject


class BusinessProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    branch_display = serializers.CharField(source='get_branch_display', read_only=True)

    class Meta:
        model = BusinessProject
        fields = [
            'id', 'name', 'branch', 'branch_display', 'client', 'client_name',
            'description', 'status', 'status_display', 'deadline',
            'contract_value', 'progress', 'demo_url', 'repo_url', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
