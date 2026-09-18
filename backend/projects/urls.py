from rest_framework.routers import DefaultRouter

from .views import BusinessProjectViewSet

router = DefaultRouter()
router.register(r'projects', BusinessProjectViewSet)

urlpatterns = router.urls
