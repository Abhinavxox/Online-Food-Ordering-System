from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('food/', include('food.urls')),
    path('user/', include('user.urls')),
    # path('cart/', include('cart.urls')),
    # path('order/', include('order.urls')),
    path('vendor/', include('vendor.urls')),
]

# Serve media files during development
if settings.DEBUG:  # This should only be used in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)