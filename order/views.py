from decimal import Decimal
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from .models import Order, OrderItem
from cart.models import Cart
from vendor.models import Vendor
from django.shortcuts import render

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user

    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found."}, status=HTTP_400_BAD_REQUEST)

    if not cart.cart_items.exists():
        return Response({"error": "Cart is empty. Cannot create order."}, status=HTTP_400_BAD_REQUEST)

    # Assign a random delivery charge between 100 and 200 as a Decimal
    delivery_charge = Decimal(random.uniform(100, 200)).quantize(Decimal('0.01'))

    # Calculate the total price
    cart_total = cart.total_price()
    total_price = cart_total + delivery_charge

    # Create the order
    order = Order.objects.create(
        user=user,
        delivery_charge=delivery_charge,
        total=total_price,
    )

    # Copy all cart items to order items
    for cart_item in cart.cart_items.all():
        #user instance
        user = cart_item.food_item.vendor

        #get vendor associated with user
        vendor = Vendor.objects.get(user=user)

        # Create an OrderItem for each cart item
        OrderItem.objects.create(
            order=order,
            food_item=cart_item.food_item,
            vendor=vendor,  # Assign the correct Vendor instance
            quantity=cart_item.quantity,
            price=cart_item.food_item.price,  # Snapshot of the price
        )

    # Clear the cart items after the order is created
    cart.cart_items.all().delete()

    # Return the order details including order items
    return Response({
        "message": "Order created successfully.",
        "order_id": order.id,
        "delivery_charge": float(delivery_charge),
        "total_price": float(total_price),
        "created_at": order.created_at,
        "items": [
            {
                "food_item": order_item.food_item.name,
                "vendor": order_item.vendor.name,  
                "quantity": order_item.quantity,
                "price": float(order_item.price),
                "total_price": float(order_item.total_price()),
            }
            for order_item in order.order_items.all()
        ]
    }, status=HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')

    order_list = [
        {
            "order_id": order.id,
            "total_price": float(order.total),
            "delivery_charge": float(order.delivery_charge),
            "created_at": order.created_at,
            "items": [
                {
                    "food_item": order_item.food_item.name,
                    "vendor": order_item.vendor.name,
                    "quantity": order_item.quantity,
                    "price": float(order_item.price),
                    "total_price": float(order_item.total_price()),
                }
                for order_item in order.order_items.all()
            ]
        }
        for order in orders
    ]

    return Response(order_list, status=HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    user = request.user

    try:
        order = Order.objects.get(user=user, id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=HTTP_400_BAD_REQUEST)

    order_details = {
        "order_id": order.id,
        "total_price": float(order.total),
        "delivery_charge": float(order.delivery_charge),
        "created_at": order.created_at,
        "items": [
            {
                "food_item": order_item.food_item.name,
                "vendor": order_item.vendor.name,
                "quantity": order_item.quantity,
                "price": float(order_item.price),
                "total_price": float(order_item.total_price()),
            }
            for order_item in order.order_items.all()
        ]
    }

    return Response(order_details, status=HTTP_200_OK)

api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_dashboard(request):
    return render(request, 'orders.html')