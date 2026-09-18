from config.api import OwnerViewSet
from .models import Product, ProductCategory
from .serializers import ProductCategorySerializer, ProductSerializer


class ProductCategoryViewSet(OwnerViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductViewSet(OwnerViewSet):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filterset_fields = ['status', 'category']
    search_fields = ['name', 'short_description', 'description']
    ordering_fields = ['price', 'created_at', 'updated_at']
    ordering = ['-created_at']
