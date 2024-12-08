from django.urls import path
from .views import create_order, list_orders, order_detail, order_dashboard

urlpatterns = [
    path('create/', create_order, name='create_order'),
    path('all/', list_orders, name='list_orders'),
    path('<int:order_id>/', order_detail, name='order_detail'),
    path('dashboard/', order_dashboard, name='order_dashboard'),
]
