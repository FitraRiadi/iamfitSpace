from django.contrib import admin

from .models import Invoice, Transaction


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('number', 'client', 'amount', 'status', 'due_date', 'owner')
    list_filter = ('status', 'owner')
    search_fields = ('number', 'notes', 'client__name')
    autocomplete_fields = ('client', 'project')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('kind', 'category', 'amount', 'occurred_on', 'owner')
    list_filter = ('kind', 'category', 'owner')
    search_fields = ('category', 'notes')
    autocomplete_fields = ('invoice', 'project')
