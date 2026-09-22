from rest_framework import serializers

from .models import Invoice, InvoiceItem, Transaction


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'amount', 'position']
        read_only_fields = ['id']


class InvoiceSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    deal_lines = serializers.SerializerMethodField()
    items = InvoiceItemSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = [
            'id', 'number', 'client', 'client_name', 'project',
            'amount', 'discount_percent', 'status', 'status_display', 'due_date', 'notes',
            'leads', 'deal_lines', 'items',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'number': {'required': False, 'allow_blank': True},
        }

    def validate_leads(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        for lead in value:
            if not user or not user.is_authenticated or lead.owner_id != user.id:
                raise serializers.ValidationError('Invalid deal(s): not yours.')
        return value

    def _save_items(self, invoice, items):
        invoice.items.all().delete()
        for i, row in enumerate(items or []):
            InvoiceItem.objects.create(
                invoice=invoice,
                description=row.get('description', ''),
                amount=row.get('amount') or 0,
                position=row.get('position', i),
            )

    def create(self, validated_data):
        items = validated_data.pop('items', [])
        invoice = super().create(validated_data)
        self._save_items(invoice, items)
        return invoice

    def update(self, instance, validated_data):
        items = validated_data.pop('items', None)
        invoice = super().update(instance, validated_data)
        if items is not None:
            self._save_items(invoice, items)
        return invoice

    def get_deal_lines(self, obj):
        return [
            {'id': l.id, 'title': l.title, 'value': float(l.value_estimate or 0), 'status': l.status}
            for l in obj.leads.all()
        ]


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
