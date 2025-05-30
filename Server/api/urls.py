from django.contrib import admin
from django.http import HttpResponse
from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


def echo(request):
    return HttpResponse("<h1>Hii how are you</h1>")

urlpatterns = [
    path("", echo,name='echo'),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/token/verify/', TokenVerifyView.as_view()),
    path("user/",include("User.urls")),
    path("dashboard/",include("dashboard.urls")),
    path("products/",include("Products.urls")),
    path("purchases/",include("Purchases.urls")),
    path("sales/",include("Sales.urls")),
    path("ledger/",include("Ledger.urls")),

    
 
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)