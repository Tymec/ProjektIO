from django.urls import include, path

from .views import ImageGenerationViewSet, image_gen, text_chat, text_gen

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
    path(
        "text/",
        include(
            [
                path("generate/", text_gen, name="text-generation-create"),
                path("chat/", text_chat, name="text-generation-chat"),
            ]
        ),
    ),
]
