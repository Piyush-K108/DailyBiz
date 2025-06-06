from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseViewSet, PurchaseItemViewSet


urlpatterns = [

        
        
]+  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

router = DefaultRouter()
router.register('purchases', PurchaseViewSet)
router.register('purchase-items', PurchaseItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]