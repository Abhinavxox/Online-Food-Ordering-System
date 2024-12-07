from django.urls import path
from .views import add_food_item_view, update_food_item_view, delete_food_item_view, update_vendor_profile, add_vendor, list_vendors, get_vendor_profile, vendor_dashboard, get_vendor_food

urlpatterns = [
    path('profile/add/', add_vendor, name='add_vendor'),
    path('profile/update/', update_vendor_profile, name='update_vendor_profile'),
    path('food-item/add/', add_food_item_view, name='add_food_item'),
    path('food-item/<int:item_id>/update/', update_food_item_view, name='update_food_item'),
    path('food-item/<int:item_id>/delete/', delete_food_item_view, name='delete_food_item'),
    path('all/', list_vendors, name='list_vendors'),
    path('dashboard/', vendor_dashboard, name='vendor_dashboard'),
    path('profile/', get_vendor_profile, name='get_vendor_profile'),
    path('food/', get_vendor_food, name='get_vendor_food'),
]
