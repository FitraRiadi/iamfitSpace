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
    lead_title = serializers.CharField(source='lead.title', read_only=True)
    invoice_number = serializers.CharField(source='invoice.number', read_only=True)
    # Write-only: create a linked draft invoice in the same request.
    auto_invoice = serializers.BooleanField(write_only=True, required=False, default=False)
    invoice_client = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    invoice_due_date = serializers.DateField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'kind', 'kind_display', 'title', 'category', 'amount',
            'occurred_on', 'lead', 'lead_title', 'invoice', 'invoice_number',
            'project', 'notes', 'created_at',
            'auto_invoice', 'invoice_client', 'invoice_due_date',
        ]
        read_only_fields = ['id', 'created_at']
