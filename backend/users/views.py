from django.contrib.auth import get_user_model
from django.core.validators import ValidationError, validate_email
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


class UserViewSet(viewsets.ModelViewSet):
    """View for viewing and editing users"""

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    # Allow filtering and ordering
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["id", "email", "name"]
    ordering = ["-id"]

    def get_view_name(self):
        return "User"

    def get_permissions(self):
        """Return the permission classes that apply to the current view"""

        if self.kwargs.get("pk", None) == "me" and self.action in [
            "retrieve",
            "update",
        ]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]

    def get_object(self):
        """Return the object the view is displaying"""
        pk = self.kwargs.get("pk", None)

        if pk == "me":
            return self.request.user

        return super().get_object()

    def dispatch(self, request, *args, **kwargs):
        """Override dispatch to allow users to view and edit their own profile"""
        return super().dispatch(request, *args, **kwargs)


class CustomTokenObtainPairView(TokenObtainPairView):
    """View for obtaining a token pair"""

    serializer_class = CustomTokenObtainPairSerializer


@api_view(["POST"])
@authentication_classes([])
def register(request):
    """Register a new user"""
    User = get_user_model()
    data = request.data

    try:
        # Check if email and password are provided
        email = data["email"]
        password = data["password"]

        # Check if user with this email already exists
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

    # Validate email
    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {"detail": "Please enter a valid email address."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Create user
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name=data["firstName"],
        last_name=data["lastName"],
    )

    # Return serialized user data with token
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)
