from rest_framework.routers import DefaultRouter

from .views import ClientViewSet, LeadStatusLogViewSet, LeadViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'lead-logs', LeadStatusLogViewSet, basename='leadstatuslog')

urlpatterns = router.urls
