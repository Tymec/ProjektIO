from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


# Create your serializers here.
class UserSerializer(ModelSerializer):
    """Serializer for the custom user model"""

    _id = SerializerMethodField(read_only=True)
    name = SerializerMethodField(read_only=True)
    firstName = SerializerMethodField(read_only=True)
    lastName = SerializerMethodField(read_only=True)
    isAdmin = SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "_id", "name", "firstName", "lastName", "isAdmin"]

    def get__id(self, obj):
        """Return the ObjectId of the user"""
        return obj.id

    def get_isAdmin(self, obj):
        """Return whether the user is an admin"""
        return obj.is_staff

    def get_name(self, obj):
        """Return the full name of the user"""
        name = f"{obj.first_name} {obj.last_name}"
        if name.strip() == "":
            name = obj.email
        return name

    def get_firstName(self, obj):
        """Return the first name of the user"""
        return obj.first_name

    def get_lastName(self, obj):
        """Return the last name of the user"""
        return obj.last_name

    def to_representation(self, instance):
        """Serialize user data"""
        ret = super().to_representation(instance)
        # Convert the ObjectId to a string
        ret["_id"] = str(ret["_id"])
        return ret


class UserSerializerWithToken(UserSerializer):
    """Serializer for the custom user model that includes an authentication token"""

    token = SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = UserSerializer.Meta.fields + ["token"]

    def get_token(self, obj):
        """Return the authentication token for the user"""
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for the authentication token"""

    @classmethod
    def get_token(cls, user):
        """Return the authentication token for the user"""
        token = super().get_token(user)

        return token

    def validate(self, attrs):
        """Return the user data and authentication token"""
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user)
        for key, value in serializer.data.items():
            data[key] = value

        return data
