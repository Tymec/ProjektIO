from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

from extra.models import ChatConversationContext, ImageGeneration, NewsletterUser

pytestmark = pytest.mark.django_db


@pytest.fixture
def subscriber():
    return NewsletterUser.objects.create(email="test@user.com")


def test_list_image_generations(api_client, user):
    ImageGeneration.objects.create(user=user, prompt="test prompt")

    api_client.force_authenticate(user=user)
    response = api_client.get(reverse("image-generation-list"))

    assert response.status_code == status.HTTP_200_OK
    assert response.data["results"]
    assert response.data["pagination"]["count"] == 1
    assert response.data["results"][0]["prompt"] == "test prompt"


def test_detail_image_generation(api_client, user):
    image_generation = ImageGeneration.objects.create(
        user=user, prompt="test prompt", image="test.png"
    )

    api_client.force_authenticate(user=user)
    response = api_client.get(
        reverse("image-generation-detail", kwargs={"pk": image_generation.pk})
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["prompt"] == "test prompt"


@patch("openai.Image.create")
def test_image_gen(mock_image_create, api_client, user):
    mock_image_create.return_value = {"data": [{"b64_json": b"dGVzdA=="}]}

    api_client.force_authenticate(user=user)
    response = api_client.post(
        reverse("image-generation-create"),
        data={"prompt": "test prompt", "size": 256},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["image"].startswith("/media/extra/")

    # Verify that the image was created and saved to the database
    image_generation = ImageGeneration.objects.get(pk=response.data["id"])
    assert image_generation
    assert image_generation.prompt == "test prompt"


@pytest.mark.parametrize(
    "prompt, size, expected_status, expected_message",
    [
        ("", 256, status.HTTP_400_BAD_REQUEST, "Prompt is required"),
        (
            "test prompt",
            0,
            status.HTTP_400_BAD_REQUEST,
            "Size must be one of 256, 512, 1024",
        ),
        (
            "test prompt",
            257,
            status.HTTP_400_BAD_REQUEST,
            "Size must be one of 256, 512, 1024",
        ),
    ],
)
def test_image_gen_invalid_data(
    api_client, user, prompt, expected_message, size, expected_status
):
    api_client.force_authenticate(user=user)
    response = api_client.post(
        reverse("image-generation-create"), data={"prompt": prompt, "size": size}
    )

    assert response.status_code == expected_status
    assert response.data["detail"] == expected_message


@patch("openai.ChatCompletion.create")
def test_text_chat(mock_chat_create, api_client):
    mock_chat_create.return_value = {
        "choices": [{"message": {"content": "test response"}}]
    }

    response = api_client.post(
        reverse("text-generation-chat"),
        data={"message": "test prompt", "model": "gpt-4"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "test response"
    assert response.data["contextId"]

    # Verify that the chat created and saved the context to the database
    ctx = ChatConversationContext.objects.get(pk=response.data["contextId"])
    assert ctx
    assert ctx.init_message == "test prompt"
    assert ctx.context["conversation"]


@pytest.mark.parametrize(
    "message, model, expected_status, expected_message",
    [
        ("", "gpt-4", status.HTTP_400_BAD_REQUEST, "Message is required"),
        (
            "test prompt",
            "gpt-5",
            status.HTTP_400_BAD_REQUEST,
            "Model must be one of gpt-3.5-turbo, gpt-4",
        ),
    ],
)
def test_text_chat_invalid_data(
    api_client, message, expected_message, model, expected_status
):
    response = api_client.post(
        reverse("text-generation-chat"), data={"message": message, "model": model}
    )

    assert response.status_code == expected_status
    assert response.data["detail"] == expected_message


def test_get_subscribers(api_client, subscriber):
    response = api_client.get(
        reverse("newsletter-get-subscriber", args=[subscriber.id])
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == subscriber.email
    assert response.data["id"] == subscriber.id
    assert response.data["active"] == subscriber.active


def test_subscribe(api_client):
    response = api_client.post(
        reverse("newsletter-subscribe"), data={"email": "test@user.com"}
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify that the subscriber was created and saved to the database
    subscriber = NewsletterUser.objects.get(email="test@user.com")
    assert subscriber
    assert subscriber.active


@pytest.mark.parametrize(
    "email, expected_status, expected_message",
    [
        ("", status.HTTP_400_BAD_REQUEST, "Email is required"),
        ("123", status.HTTP_400_BAD_REQUEST, "Please enter a valid email address."),
    ],
)
def test_subscribe_invalid_data(api_client, email, expected_message, expected_status):
    response = api_client.post(reverse("newsletter-subscribe"), data={"email": email})

    assert response.status_code == expected_status
    assert response.data["detail"] == expected_message


def test_unsubscribe(api_client, subscriber):
    response = api_client.post(
        reverse("newsletter-unsubscribe"), data={"email": subscriber.email}
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify that the subscriber was updated in the database
    subscriber.refresh_from_db()
    assert not subscriber.active


@pytest.mark.parametrize(
    "email, expected_status, expected_message",
    [
        ("", status.HTTP_400_BAD_REQUEST, "Email is required"),
        ("123", status.HTTP_400_BAD_REQUEST, "Please enter a valid email address."),
    ],
)
def test_unsubscribe_invalid_data(api_client, email, expected_message, expected_status):
    response = api_client.post(reverse("newsletter-unsubscribe"), data={"email": email})

    assert response.status_code == expected_status
    assert response.data["detail"] == expected_message


@patch("smtplib.SMTP_SSL.sendmail")
def test_send_newsletter(mock_sendmail, superuser, api_client):
    api_client.force_authenticate(user=superuser)

    NewsletterUser.objects.all().delete()

    response = api_client.post(
        reverse("newsletter-send"),
        data={
            "subject": "test subject",
            "content": "<p>test content</p>",
        },
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["detail"] == "No active newsletter users"
    assert response.data["data"]
    assert response.data["data"]["count"] == 0
    assert len(response.data["data"]["recievers"]) == 0


@patch("openai.Image.create")
@patch("openai.ChatCompletion.create")
def test_generate_product(mock_chat_create, mock_image_create, api_client, superuser):
    api_client.force_authenticate(user=superuser)

    mock_chat_create.return_value = {
        "choices": [
            {"message": {"content": "test product|test brand|test description|0.0"}}
        ]
    }
    mock_image_create.return_value = {"data": [{"b64_json": "dGVzdA=="}]}

    response = api_client.post(
        reverse("generate-product"),
        data={"prompt": "test prompt"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data


@patch("openai.Image.create")
@patch("openai.ChatCompletion.create")
@pytest.mark.parametrize(
    "prompt, product_output, expected_status, expected_message, is_superuser",
    [
        (
            "",
            "test product|test brand|test description|0.0",
            status.HTTP_400_BAD_REQUEST,
            "Prompt is required",
            True,
        ),
        (
            "test prompt",
            "",
            status.HTTP_400_BAD_REQUEST,
            "Product generation failed",
            True,
        ),
        (
            "test prompt",
            "test product|test brand|test description|0.0",
            status.HTTP_403_FORBIDDEN,
            "You do not have permission to perform this action.",
            False,
        ),
    ],
)
def test_generate_product_invalid_data(
    mock_chat_create,
    mock_image_create,
    api_client,
    superuser,
    user,
    prompt,
    product_output,
    expected_message,
    expected_status,
    is_superuser,
):
    if is_superuser:
        api_client.force_authenticate(user=superuser)
    else:
        api_client.force_authenticate(user=user)

    mock_chat_create.return_value = {
        "choices": [{"message": {"content": product_output}}]
    }
    mock_image_create.return_value = {"data": [{"b64_json": "dGVzdA=="}]}

    response = api_client.post(
        reverse("generate-product"),
        data={"prompt": prompt},
        format="json",
    )

    assert response.status_code == expected_status
    assert response.data["detail"] == expected_message
