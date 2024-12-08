from django.urls import path
from .views import add_to_cart, view_cart, remove_from_cart, update_cart_item_quantity, cart_render

urlpatterns = [
    path('add/', add_to_cart, name='add_to_cart'),
    path('view/', view_cart, name='view_cart'),
    path('remove/', remove_from_cart, name='remove_from_cart'),
    path('update_quantity/', update_cart_item_quantity, name='update_cart_item_quantity'),
    path('view/<int:user_id>/', cart_render, name='view_cart'),
]
