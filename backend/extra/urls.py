from django.urls import include, path

from .views import (
    ImageGenerationViewSet,
    image_gen,
    newsletter_send,
    newsletter_subscribe,
    newsletter_unsubscribe,
    text_chat,
)

urlpatterns = [
    path(
        "image/",
        include(
            [
                path(
                    "",
                    ImageGenerationViewSet.as_view({"get": "list"}),
                    name="image-generation-list",
                ),
                path(
                    "<int:pk>/",
                    ImageGenerationViewSet.as_view({"get": "retrieve"}),
                    name="image-generation-detail",
                ),
                path("generate/", image_gen, name="image-generation-create"),
            ]
        ),
    ),
    path("chat/", text_chat, name="text-generation-chat"),
    path(
        "newsletter/",
        include(
            [
                path("subscribe/", newsletter_subscribe, name="newsletter-subscribe"),
                path(
                    "unsubscribe/",
                    newsletter_unsubscribe,
                    name="newsletter-unsubscribe",
                ),
                path("send/", newsletter_send, name="newsletter-send"),
            ]
        ),
    ),
]
