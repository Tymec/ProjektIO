from django.urls import path

from users.views import CustomTokenObtainPairView, UserViewSet, register

user_list = UserViewSet.as_view({"get": "list"})
user_detail = UserViewSet.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

# Define API endpoints
urlpatterns = [
    path("", user_list, name="user-list"),
    path("<str:pk>/", user_detail, name="user-detail"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("register/", register, name="register"),
]
