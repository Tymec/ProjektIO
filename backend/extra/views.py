import os
import uuid
from base64 import b64decode

import openai
from django.core.files.base import ContentFile
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ImageGeneration
from .serializers import ImageGenerationSerializer


class ImageGenerationViewSet(viewsets.ModelViewSet):
    queryset = ImageGeneration.objects.all()
    serializer_class = ImageGenerationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ImageGeneration.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def image_gen(request):
    data = request.data

    user = request.user
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    prompt = data.get("prompt", None)
    if not prompt:
        return Response(
            {"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    size = data.get("size", 256)
    if size not in [256, 512, 1024]:
        return Response(
            {"error": "Size must be one of 256, 512, 1024"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size=f"{size}x{size}",
        response_format="b64_json",
        user=f"{user.id}-{user.email}",
    )

    image_data = b64decode(response["data"][0]["b64_json"])
    content = ContentFile(image_data, name=f"{user.id}-{uuid.uuid4()}.png")

    image = ImageGeneration.objects.create(
        user=user,
        prompt=prompt,
        image=content,
    )

    serializer = ImageGenerationSerializer(image, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def text_gen(request):
    raise NotImplementedError


@api_view(["POST"])
def text_chat(request):
    raise NotImplementedError
