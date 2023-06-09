from django.urls import path
from users.views import CustomTokenObtainPairView, UserViewSet, register

user_list = UserViewSet.as_view({"get": "list", "post": "create"})
user_detail = UserViewSet.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("", user_list, name="user-list"),
    path("<int:pk>/", user_detail, name="user-detail"),
    path("me/", user_detail, name="user-me", kwargs={"pk": "me"}),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("register/", register, name="register"),
]
