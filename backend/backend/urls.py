from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenObtainPairView  # pre-built views that allow us to obtain access/refresh tokens and to refresh token, use these views to 

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),  # hen we go to this path it calls this view
    # link token obstain/refresh
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),   # send request to this path when login is pressed
    path("api/token/refresh/", TokenObtainPairView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),

    # forward specific urls to api/urls.py, whenever we have api/ and it wasn't one of the ones above check under api.urls
    path("api/", include("api.urls"))

]
