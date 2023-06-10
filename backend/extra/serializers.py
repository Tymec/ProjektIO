from rest_framework.serializers import ModelSerializer

from .models import ChatConversationContext, ImageGeneration, NewsletterUser


class ImageGenerationSerializer(ModelSerializer):
    """Serializer for the ImageGeneration model"""

    class Meta:
        model = ImageGeneration
        fields = "__all__"


class NewsletterUserSerializer(ModelSerializer):
    """Serializer for the NewsletterUser model"""

    class Meta:
        model = NewsletterUser
        fields = "__all__"


class ChatConversationContextSerializer(ModelSerializer):
    """Serializer for the ChatConversationContext model"""

    class Meta:
        model = ChatConversationContext
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize chatbot conversation context data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        return ret
