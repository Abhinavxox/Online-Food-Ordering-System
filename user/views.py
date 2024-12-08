from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import SignupSerializer, LoginSerializer
from django.shortcuts import render
from rest_framework.response import Response as JSONResponse
from cart.models import Cart
from user.models import User

@api_view(['GET','POST'])
def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    elif request.method == 'POST':    
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Cart.objects.create(user=user)
            token, _ = Token.objects.get_or_create(user=user)
            return JSONResponse({"token": token.key, "message": "Signup successful", "user":{
                    "id": user.id,
                    "username": user.username,
                    "email": user.email, 
                    'is_vendor': user.is_vendor | user.is_staff
                }}, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = User.objects.get(username=username)
            if user and user.password == password:
                token, _ = Token.objects.get_or_create(user=user)
                return JSONResponse({"token": token.key, "user":{
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    'is_vendor': user.is_vendor | user.is_staff
                }}, status=HTTP_200_OK)
                
            return Response({"error": "Invalid credentials"}, status=HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello, {request.user.username}! You are authenticated."}, status=HTTP_200_OK)
