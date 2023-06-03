from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Create your serializers here.
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["email"] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra data to display
        data["username"] = self.user.username
        data["email"] = self.user.email

        return data


class UserSerializer(serializers.Serializer):
    class Meta:
        model = settings.AUTH_USER_MODEL
        fields = "__all__"
