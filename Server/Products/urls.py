from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
urlpatterns = [

    path('', include(router.urls))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
