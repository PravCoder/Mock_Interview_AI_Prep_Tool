from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User 
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(["POST"])
def create_job(request):
    print(request.data)
    return Response({"m":"helllooo"})



# TESTING PURPOSES ONLY BELOW
foo_db = ["foo1","foo1","foo1","foo1","foo1" ]
@api_view(["GET"]) # his view function will respond to HTTP GET requests. When a GET request is made to the corresponding URL (e.g., /api/hello-world/), this function will be invoked
def get_foo(request):
    print(f"USER: {request.user}")
    for user in User.objects.all():
        print(user)

    user_serializer = UserSerializer(request.user)
    return Response({'foo_list': foo_db, "user":user_serializer.data["email"]})

@api_view(["POST"]) # his view function will respond to HTTP GET requests. When a GET request is made to the corresponding URL (e.g., /api/hello-world/), this function will be invoked
def create_foo(request):
    print("HELLOasdasdasdasdasdasdasdasdas")
    content = request.data["content"]
    foo_db.append(content)
    return Response({'foo_list': foo_db})