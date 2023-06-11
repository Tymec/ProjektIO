import pytest
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserSerializerWithToken,
)

pytestmark = pytest.mark.django_db


def test_user_serializer(user):
    serializer = UserSerializer(user)
    assert serializer.data["email"] == "test@user.com"
    assert serializer.data["_id"] == str(user.id)
    assert serializer.data["name"] == "Test User"
    assert serializer.data["firstName"] == "Test"
    assert serializer.data["lastName"] == "User"
    assert not serializer.data["isAdmin"]


def test_user_serializer_with_token(user):
    serializer = UserSerializerWithToken(user)
    assert serializer.data["email"] == "test@user.com"
    assert serializer.data["_id"] == str(user.id)
    assert serializer.data["name"] == "Test User"
    assert serializer.data["firstName"] == "Test"
    assert serializer.data["lastName"] == "User"
    assert not serializer.data["isAdmin"]
    assert "token" in serializer.data


def test_custom_token_obtain_pair_serializer(user):
    serializer = CustomTokenObtainPairSerializer()
    validated_data = serializer.validate(
        {"email": "test@user.com", "password": "testpass"}
    )
    token = RefreshToken.for_user(user)

    assert "access" in validated_data
    assert "refresh" in validated_data
    assert token.access_token
    assert validated_data["access"] != str(token.access_token)
    assert validated_data["refresh"] != str(token)


def test_list_users(api_client, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(reverse("user-list"))

    assert response.status_code == 200
    assert response.data
    assert "results" in response.data
    assert "pagination" in response.data
    assert "links" in response.data


def test_list_users_invalid(api_client):
    response = api_client.get(reverse("user-list"))

    assert response.status_code == 401


def test_detail_user(api_client, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(reverse("user-detail", args=[superuser.id]))

    assert response.status_code == 200
    assert response.data
    assert response.data["email"] == superuser.email


def test_detail_me(api_client, user):
    api_client.force_authenticate(user)

    response = api_client.get(reverse("user-me"))

    assert response.status_code == 200
    assert response.data
    assert response.data["email"] == user.email


def test_detail_invalid_me(api_client):
    response = api_client.get(reverse("user-me"))

    assert response.status_code == 401


def test_update_me(api_client, user):
    api_client.force_authenticate(user)

    response = api_client.put(
        reverse("user-me"),
        {
            "email": "always@never.com",
            "password": "newpass",
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data
    assert response.data["email"] == "always@never.com"


def test_update_invalid_me(api_client):
    response = api_client.put(
        reverse("user-me"),
        {
            "email": "new@email.com",
            "password": "newpass",
        },
        format="json",
    )

    assert response.status_code == 401


def test_login_user(api_client, user):
    assert api_client.login(email=user.email, password="testpass")


def test_login_invalid_user(api_client, user):
    assert not api_client.login(email=user.email, password="wrong")
