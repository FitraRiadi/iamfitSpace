from config.api import OwnerViewSet
from .models import BusinessProject
from .serializers import BusinessProjectSerializer


class BusinessProjectViewSet(OwnerViewSet):
    queryset = BusinessProject.objects.select_related('client').all()
    serializer_class = BusinessProjectSerializer
    filterset_fields = ['status', 'branch', 'client']
    search_fields = ['name', 'description', 'notes']
    ordering_fields = ['deadline', 'contract_value', 'progress', 'created_at', 'updated_at']
    ordering = ['-created_at']
