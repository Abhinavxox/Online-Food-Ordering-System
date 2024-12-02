from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from .models import Cart, CartItem, FoodItem
from .models import Cart

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    user = request.user
    
    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"message": "Cart is empty."}, status=HTTP_404_NOT_FOUND)

    cart_items = cart.cart_items.all()
    cart_details = {
        "cart_id": cart.id,
        "user": user.username,
        "total_price": cart.total_price(),
        "items": [
            {
                "food_item_id": item.food_item.id,
                "food_item_name": item.food_item.name,
                "description": item.food_item.description,
                "price": float(item.food_item.price),
                "quantity": item.quantity,
                "total_price": item.total_price(),
            }
            for item in cart_items
        ]
    }

    return Response(cart_details, status=HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    food_item_id = request.data.get('food_item_id')
    quantity = request.data.get('quantity', 1)  # Default quantity is 1
    
    if not food_item_id:
        return Response({"error": "Food item ID is required."}, status=HTTP_400_BAD_REQUEST)
    
    try:
        food_item = FoodItem.objects.get(id=food_item_id)
    except FoodItem.DoesNotExist:
        return Response({"error": "Food item not found."}, status=HTTP_404_NOT_FOUND)
    
    cart, _ = Cart.objects.get_or_create(user=user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, food_item=food_item)

    if created:
        cart_item.quantity = int(quantity)  # Set quantity for new item
        message = "Food item added to cart."
    else:
        cart_item.quantity += int(quantity)  # Increment quantity for existing item
        message = "Food item quantity updated in cart."

    cart_item.save()
    
    return Response({
        "message": message,
        "cart_item_id": cart_item.id,
        "quantity": cart_item.quantity
    }, status=HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    user = request.user
    food_item_id = request.data.get('food_item_id')
    
    if not food_item_id:
        return Response({"error": "Food item ID is required."}, status=HTTP_400_BAD_REQUEST)
    
    try:
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(cart=cart, food_item_id=food_item_id)
        cart_item.delete()
        return Response({"message": "Food item removed from cart."}, status=HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found."}, status=HTTP_404_NOT_FOUND)
    except CartItem.DoesNotExist:
        return Response({"error": "Food item not found in cart."}, status=HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_item_quantity(request):
    user = request.user
    food_item_id = request.data.get('food_item_id')
    quantity_change = request.data.get('quantity_change')  # Positive or negative integer

    if not food_item_id:
        return Response({"error": "Food item ID is required."}, status=HTTP_400_BAD_REQUEST)
    
    if quantity_change is None:
        return Response({"error": "Quantity change is required."}, status=HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(cart=cart, food_item_id=food_item_id)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found."}, status=HTTP_404_NOT_FOUND)
    except CartItem.DoesNotExist:
        return Response({"error": "Food item not found in cart."}, status=HTTP_404_NOT_FOUND)

    # Update quantity

    if quantity_change != 0:
        cart_item.quantity = quantity_change
        cart_item.save()
        message = "Food item quantity updated in cart."
    else:
        cart_item.delete()
        message = "Food item removed from cart."

    return Response({
        "message": message,
        "cart_item_id": cart_item.id if cart_item.pk else None,
        "quantity": quantity_change
    }, status=HTTP_200_OK)