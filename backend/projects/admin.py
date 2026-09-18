from django.contrib import admin

from .models import BusinessProject


@admin.register(BusinessProject)
class BusinessProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch', 'status', 'progress', 'deadline', 'owner', 'updated_at')
    list_filter = ('branch', 'status', 'owner')
    search_fields = ('name', 'description', 'notes')
    autocomplete_fields = ('client',)
