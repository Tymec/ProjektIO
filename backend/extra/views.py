import re
import smtplib
import ssl
import uuid
from base64 import b64decode
from email.message import EmailMessage

import openai
from app.models import Product
from bs4 import BeautifulSoup
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.files.base import ContentFile
from django.core.validators import ValidationError, validate_email
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import ChatConversationContext, ImageGeneration, NewsletterUser
from .serializers import ImageGenerationSerializer, NewsletterUserSerializer


class ImageGenerationViewSet(viewsets.ModelViewSet):
    """View for listing and viewing image generations"""

    queryset = ImageGeneration.objects.all()
    serializer_class = ImageGenerationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only the image generations for the current user"""
        return ImageGeneration.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def image_gen(request):
    """Generate an image using DALL-E 2"""
    data = request.data

    user = request.user
    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    prompt = data.get("prompt", None)
    if not prompt:
        return Response(
            {"detail": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    size = data.get("size", 256)
    if size not in [256, 512, 1024]:
        return Response(
            {"detail": "Size must be one of 256, 512, 1024"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    openai.api_key = settings.OPENAI_API_KEY
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size=f"{size}x{size}",
        response_format="b64_json",
        user=f"{user.id}-{user.email}",
    )

    # Convert the image into a file for storage
    image_data = b64decode(response["data"][0]["b64_json"])
    content = ContentFile(image_data, name=f"{user.id}-{uuid.uuid4()}.png")

    image = ImageGeneration.objects.create(
        user=user,
        prompt=prompt,
        image=content,
    )

    # Return the newly created serialized entity from the database
    serializer = ImageGenerationSerializer(image, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([])
def text_chat(request):
    """Chat with GPT-3.5/GPT-4"""
    data = request.data

    message = data.get("message", None)
    if not message:
        return Response(
            {"detail": "Message is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    # The context allows us to store the conversation history, so that the frontend
    # doesn't have to keep track of it
    context_id = data.get("contextId", None)
    context = None
    if context_id:
        try:
            context = ChatConversationContext.objects.get(_id=context_id)
        except Exception:
            pass

    if not context:
        # Create a new context if one doesn't exist
        context = ChatConversationContext.objects.create(
            init_message=message, context={"conversation": []}
        )

    user = request.user
    if user.is_authenticated:
        user = {"id": user.id, "name": user.email}
    else:
        user = {"id": "0", "name": "Anonymous"}

    # Fetch all available products and format them for the chatbot to use
    products = list(Product.objects.filter(countInStock__gt=0).values())
    products = [
        f"({product['_id']}|'{product['name']}|{product['description'].strip()}|{product['rating']})"
        for product in products
    ]
    products = [product.replace("\n", " ") for product in products]

    openai.api_key = settings.OPENAI_API_KEY
    response = openai.ChatCompletion.create(
        model=request.POST.get("model", "gpt-3.5-turbo"),
        messages=[
            # The system message is used to tell the chatbot what to do
            {
                "role": "system",
                "content": f"""
                You are a chatbot assistant that helps users find the best product for them.
                Here are the available products in the form of (id|name|description|rating): {', '.join(products)}
                When recommending products make sure to include the id of the product in the message (the ID will be extracted with regex, so make sure when the ID is removed the message still makes sense and is formatted correctly).
                Never share any URLs or personal information.
                """,
            },
            # Initial message
            {
                "role": "assistant",
                "content": "Welcome to the chatbot, I will help you find the best product for you",
            },
            # Conversation history
            *[message for message in context.context["conversation"] if message],
            # User message
            {"role": "user", "content": message},
        ],
        max_tokens=200,
        user=f"{user['id']}-{user['name']}",
    )
    # Store the response
    message_response = response["choices"][0]["message"]["content"]

    # Update the conversation history
    conversation = context.context["conversation"] + [
        {"role": "user", "content": message},
        {"role": "assistant", "content": message_response},
    ]

    # Update the context
    context.context = {"conversation": conversation}
    context.save()

    # Return the response
    return Response(
        {"message": message_response, "contextId": str(context._id)},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([])
def get_subscriber(request, pk):
    """Get a newsletter subscriber by ID"""
    try:
        subscriber = NewsletterUser.objects.get(pk=pk)
        serializer = NewsletterUserSerializer(subscriber, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception:
        return Response(
            {"detail": "Subscriber does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([])
def newsletter_subscribe(request):
    """Subscribe to the newsletter with an email"""
    data = request.data

    email = data.get("email", None)
    if not email:
        return Response(
            {"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {"detail": "Please enter a valid email address."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        newsletter_user = NewsletterUser.objects.get(email=email)

        # If the user already exists in the database, but is not active, activate them
        if not newsletter_user.active:
            newsletter_user.active = True
            newsletter_user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"detail": "Email already subscribed"}, status=status.HTTP_400_BAD_REQUEST
        )
    except NewsletterUser.DoesNotExist:
        pass

    NewsletterUser.objects.create(email=email)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([])
def newsletter_unsubscribe(request):
    """Unsubscribe from the newsletter with an email"""
    data = request.data

    email = data.get("email", None)
    if not email:
        return Response(
            {"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {"detail": "Please enter a valid email address."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        newsletter_user = NewsletterUser.objects.get(email=email)
        if not newsletter_user.active:
            raise NewsletterUser.DoesNotExist

        # Instead of deleting the user, just set them to inactive (soft delete)
        newsletter_user.active = False
        newsletter_user.save()
    except NewsletterUser.DoesNotExist:
        return Response(
            {"detail": "Email not subscribed"}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def newsletter_send(request):
    """Send a newsletter to all subscribers"""
    data = request.data

    subject = data.get("subject", None)
    if not subject:
        return Response(
            {"detail": "Subject is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    content = data.get("content", None)
    if not content:
        return Response(
            {"detail": "Content is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    # The content can either be a valid HTML string or a key-value pair dictionary along with a template name
    try:
        valid_html = bool(BeautifulSoup(content, "html.parser").find())
    except Exception:
        valid_html = False

    if not valid_html:
        template = data.get("template", None)
        if not template:
            return Response(
                {"detail": "Content is not valid HTML and no template was specified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(content, dict):
            return Response(
                {"detail": "Content must be a dictionary if using a template"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Fetch the template from the static files storage
            with staticfiles_storage.open(
                f"templates/newsletter/{template}.html", mode="r"
            ) as f:
                template = f.read()

            # Format the template with the content
            for key, value in content.items():
                template = template.replace("{{ " + key + " }}", value)
            content = re.sub(r"\{\{(.+?)\}\}", "", template)
        except Exception as e:
            print(e)
            return Response(
                {"detail": "Template is not valid or does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Get all active newsletter users
    newsletter_users = NewsletterUser.objects.filter(active=True)
    recievers = [newsletter_user.email for newsletter_user in newsletter_users]

    if not recievers:
        return Response(
            {"detail": "No active newsletter users"},
            status=status.HTTP_200_OK,
        )

    # Create the email
    email = EmailMessage()
    email["From"] = "PromptWorld Newsletter"
    email["Subject"] = subject
    email.set_content(content, subtype="html")

    # Send the email
    with smtplib.SMTP_SSL(
        settings.SMTP_HOST, settings.SMTP_PORT, context=ssl.create_default_context()
    ) as smtp:
        smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        smtp.sendmail(settings.SMTP_USER, recievers, email.as_string())

    return Response(
        {
            "status": "success",
            "data": {
                "count": len(recievers),
                "recievers": recievers,
            },
        },
        status=status.HTTP_200_OK,
    )
