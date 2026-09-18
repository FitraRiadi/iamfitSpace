from rest_framework import serializers

from .models import Invoice, Transaction


class InvoiceSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'number', 'client', 'client_name', 'project',
            'amount', 'status', 'status_display', 'due_date', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'kind', 'kind_display', 'category', 'amount',
            'occurred_on', 'invoice', 'project', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
