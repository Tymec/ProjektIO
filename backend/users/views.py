from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample, OpenApiParameter, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.decorators import permission_classes as perm
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer, UserSerializerWithToken


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    User view.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

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


@extend_schema(
    request=UserSerializer,
    responses={200: UserSerializerWithToken},
    examples=[
        OpenApiExample(
            "Register",
            description="Register a new user.",
            value={
                "email": "user@email.com",
                "first_name": "John",
                "last_name": "Doe",
                "password": "password",
            },
        )
    ],
    parameters=[
        OpenApiParameter(
            name="email",
            description="User email.",
            required=True,
            type=OpenApiTypes.EMAIL,
        ),
        OpenApiParameter(
            name="first_name",
            description="User first name.",
            required=True,
            type=OpenApiTypes.STR,
        ),
        OpenApiParameter(
            name="last_name",
            description="User last name.",
            required=True,
            type=OpenApiTypes.STR,
        ),
        OpenApiParameter(
            name="password",
            description="User password.",
            required=True,
            type=OpenApiTypes.PASSWORD,
        ),
    ],
)
@api_view(["POST"])
@perm([AllowAny])
def register(request):
    User = get_user_model()
    data = request.data

    try:
        data["email"], data["first_name"], data["last_name"], data["password"]

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
        password=make_password(data["password"]),
    )

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@perm([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)
