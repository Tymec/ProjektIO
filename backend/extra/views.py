import os
import uuid
from base64 import b64decode

import openai
from app.models import Product
from app.serializers import ProductSerializer
from django.conf import settings
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
@permission_classes([])
def text_chat(request):
    data = request.data

    message = data.get("message", None)
    if not message:
        return Response(
            {"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    conversation = data.get("conversation", [])
    if not isinstance(conversation, list):
        return Response(
            {"error": "Conversation must be a list"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user
    user = (
        {"id": "0", "name": "Anonymous"}
        if not user
        else {"id": user.id, "name": user.email}
    )

    products = list(Product.objects.filter(countInStock__gt=0).values())
    products = [
        f"({product['_id']}|'{product['name']}|{product['description'].strip()}|{product['rating']})"
        for product in products
    ]
    products = [product.replace("\n", " ") for product in products]

    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.ChatCompletion.create(
        model=request.POST.get("model", "gpt-3.5-turbo"),
        messages=[
            {
                "role": "system",
                "content": f"""
                You are a chatbot assistant that helps users find the best product for them.
                Here are the available products in the form of (id|name|description|rating): {', '.join(products)}
                When recommending a product, always include the URL to the product page which is '{settings.FRONTNED_URL}/product/<product_id>/'
                and NEVER include the product id in the message unless it's part of the URL.

                Do not include the product id in the message outright, but you can include it in the URL to the product page.
                """,
            },
            {
                "role": "assistant",
                "content": "Welcome to the chatbot, I will help you find the best product for you",
            },
            *[message for message in conversation if message],
            {"role": "user", "content": message},
        ],
        max_tokens=100,
        user=f"{user['id']}-{user['name']}",
    )

    message_response = response["choices"][0]["message"]
    return Response(
        {
            "message": message_response["content"],
            "conversation": conversation
            + [{"role": "user", "content": message}, message_response],
        },
        status=status.HTTP_200_OK,
    )
