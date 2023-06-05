from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


# Create your serializers here.
class UserSerializer(ModelSerializer):
    _id = SerializerMethodField(read_only=True)
    name = SerializerMethodField(read_only=True)
    is_admin = SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "_id", "name", "is_admin", "orders"]

    def get__id(self, obj):
        return obj.id

    def get_is_admin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}"
        if name.strip() == "":
            name = obj.username
        return name

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        return ret


class UserSerializerWithToken(UserSerializer):
    token = SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = UserSerializer.Meta.fields + ["token"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["email"] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user)
        for key, value in serializer.data.items():
            data[key] = value

        return data
