from rest_framework.serializers import ModelSerializer

from .models import ImageGeneration, NewsletterUser


class ImageGenerationSerializer(ModelSerializer):
    class Meta:
        model = ImageGeneration
        fields = "__all__"


class NewsletterUserSerializer(ModelSerializer):
    class Meta:
        model = NewsletterUser
        fields = "__all__"
