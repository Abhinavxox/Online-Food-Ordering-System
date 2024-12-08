from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from food.serializers import FoodItemSerializer
from food.models import FoodItem
from .models import Vendor
from .serializers import VendorSerializer
from rest_framework import status
from user.models import User
from django.shortcuts import render

def is_vendor(user):
    return user.is_authenticated and user.is_vendor

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def add_food_item_view(request):
    if not is_vendor(request.user):
        return Response({"error": "Only vendors can add food items."}, status=403)

    serializer = FoodItemSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_food_item_view(request, item_id):
    food_item = get_object_or_404(FoodItem, id=item_id, vendor=request.user)

    serializer = FoodItemSerializer(food_item, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_food_item_view(request, item_id):
    food_item = get_object_or_404(FoodItem, id=item_id, vendor=request.user)

    food_item.delete()
    return Response({"message": "Food item deleted successfully."}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_vendor(request):
    user_id = request.data.get('user_id')  # ID of the user to promote to vendor
    vendor_data = request.data.get('vendor', {})  # Vendor-specific details

    try:
        user = User.objects.get(id=user_id)
        if user.is_vendor:
            return Response({"error": "User is already a vendor."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_vendor = True
        user.is_customer = False
        user.save()

        vendor = Vendor.objects.create(
            user=user,
            name=vendor_data.get('name', f"Vendor_{user.username}"),
            description=vendor_data.get('description', ''),
            address=vendor_data.get('address', ''),
            phone=vendor_data.get('phone', ''),
            image=vendor_data.get('image', None)  # Optional
        )

        return Response({"message": f"Vendor {vendor.name} created successfully."}, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_vendor_profile(request):
    try:
        if not request.user.is_vendor:
            return Response({"error": "Only vendors can update their profile."}, status=status.HTTP_403_FORBIDDEN)
        vendor = Vendor.objects.get(user=request.user)
        serializer = VendorSerializer(vendor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Vendor.DoesNotExist:
        return Response({"error": "Vendor profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def list_vendors(request):
    vendors = Vendor.objects.all()
    serializer = VendorSerializer(vendors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def vendor_dashboard(request):
    return render(request, 'vendordashboard.html')

@api_view(['GET'])
def vendor_menu(request, vendor_id):
    return render(request, 'menu.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vendor_profile(request):
    vendor = get_object_or_404(Vendor, user=request.user)
    serializer = VendorSerializer(vendor)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_vendor_food(request):
    food_items = FoodItem.objects.filter(vendor=request.user)
    serializer = FoodItemSerializer(food_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_vendor_food2(request, vendor_id):
    food_items = FoodItem.objects.filter(vendor=vendor_id)
    serializer = FoodItemSerializer(food_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_vendor_profile_menu(request, vendor_id):
    vendor = get_object_or_404(Vendor, id=vendor_id)
    serializer = VendorSerializer(vendor)
    return Response(serializer.data, status=status.HTTP_200_OK)