from django.contrib import admin

from .models import Client, Lead, LeadStatusLog


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'email', 'owner', 'created_at')
    list_filter = ('owner',)
    search_fields = ('name', 'company', 'email', 'contact')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'value_estimate', 'follow_up_date', 'owner', 'updated_at')
    list_filter = ('status', 'owner')
    search_fields = ('title', 'contact', 'notes')
    autocomplete_fields = ('client',)


@admin.register(LeadStatusLog)
class LeadStatusLogAdmin(admin.ModelAdmin):
    list_display = ('lead', 'from_status', 'to_status', 'changed_by', 'created_at')
    list_filter = ('to_status',)
    readonly_fields = ('created_at',)
