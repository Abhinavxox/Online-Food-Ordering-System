from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import SignupSerializer, LoginSerializer
from django.shortcuts import render
import datetime

@api_view(['GET','POST'])
def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    elif request.method == 'POST':    
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            response = Response({"token": token.key, "message": "Signup successful"}, status=HTTP_200_OK)
            response.set_cookie(
                'token',
                token.key,
                max_age=datetime.timedelta(days=1), 
                httponly=True, 
                secure=True, 
                samesite='Lax'
            )
            return response
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
            user = authenticate(username=username, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                response =  Response({"token": token.key}, status=HTTP_200_OK)
                response.set_cookie(
                    'token',
                    token.key,
                    max_age=datetime.timedelta(days=1), 
                    httponly=True, 
                    secure=True, 
                    samesite='Lax'
                )
                return response
            return Response({"error": "Invalid credentials"}, status=HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello, {request.user.username}! You are authenticated."}, status=HTTP_200_OK)

@api_view(['GET'])
def logout(request):
    #check if token is there in the request

    if 'token' in request.COOKIES:
        #just return the token
        token = request.COOKIES['token']
    return Response({"error": "No token found"}, status=HTTP_400_BAD_REQUEST)