from django.contrib.auth import get_user_model
from rest_framework import filters, status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserSerializerWithToken,
)


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    User view.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["id", "email", "name"]
    ordering = ["-id"]

    def get_view_name(self):
        return "User"

    def get_permissions(self):
        if self.action == "me":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]

    def get_object(self):
        pk = self.kwargs.get("pk", None)

        if pk == "me":
            return self.request.user

        return super().get_object()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["POST"])
@authentication_classes([])
def register(request):
    User = get_user_model()
    data = request.data

    try:
        data["email"], data["password"]

        User.objects.get(email=data["email"])
        return Response(
            {"detail": "User with this email already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except KeyError:
        return Response(
            {"detail": "Please provide all required fields."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except User.DoesNotExist:
        pass

    user = User.objects.create_user(
        email=data["email"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        password=data["password"],
    )

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)
