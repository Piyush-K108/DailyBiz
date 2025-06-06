from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, SaleItemViewSet

urlpatterns = [

        
        
]+  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

router = DefaultRouter()
router.register('sales', SaleViewSet)
router.register('sale-items', SaleItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]