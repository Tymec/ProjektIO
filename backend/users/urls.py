from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView
from users.views import UserViewSet, logout, register

user_list = UserViewSet.as_view({"get": "list", "post": "create"})
user_detail = UserViewSet.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("", user_list, name="user-list"),
    path("<int:pk>/", user_detail, name="user-detail"),
    path("me/", user_detail, name="user-me", kwargs={"pk": "me"}),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", logout, name="logout"),
    path("register/", register, name="register"),
]
