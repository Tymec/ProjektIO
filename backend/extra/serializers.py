from rest_framework.serializers import ModelSerializer

from .models import ImageGeneration


class ImageGenerationSerializer(ModelSerializer):
    class Meta:
        model = ImageGeneration
        fields = "__all__"
