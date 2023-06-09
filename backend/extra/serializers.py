from rest_framework.serializers import ModelSerializer

from .models import ChatConversationContext, ImageGeneration, NewsletterUser


class ImageGenerationSerializer(ModelSerializer):
    class Meta:
        model = ImageGeneration
        fields = "__all__"


class NewsletterUserSerializer(ModelSerializer):
    class Meta:
        model = NewsletterUser
        fields = "__all__"


class ChatConversationContextSerializer(ModelSerializer):
    class Meta:
        model = ChatConversationContext
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        return ret
