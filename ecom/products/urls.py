from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import add_product
from . views import delete_product

urlpatterns = [
    path("add-product/", add_product, name="add_product"),
    path("delete_product/<int:product_id>/", delete_product, name="delete_product"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)