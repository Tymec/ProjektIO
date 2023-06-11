import pytest
from django.urls import reverse
from rest_framework import status

from payments.models import Customer
from payments.serializers import CustomerSerializer

pytestmark = pytest.mark.django_db


@pytest.fixture
def sample_customer(user):
    return Customer.objects.create(user=user)


def test_customer_view_get(api_client, user, sample_customer):
    api_client.force_authenticate(user=user)
    url = reverse("customer")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data == CustomerSerializer(sample_customer).data


def test_customer_view_post(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse("customer")
    data = {"name": "John Doe", "email": "john@example.com"}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["user"] == str(user.id)
    assert not response.data["stripeCustomerId"]
    assert Customer.objects.filter(user=user).exists()


def test_stripe_checkout_view_post(api_client, user, sample_product, sample_order):
    api_client.force_authenticate(user=user)
    url = reverse("stripe-checkout")
    data = {
        "cart": [{"id": str(sample_product._id), "qty": 1}],
        "redirectUrl": "http://localhost:3000",
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.data


def test_stripe_webhook_view_post(api_client):
    url = reverse("stripe-webhook")
    payload = {"example": "payload"}
    response = api_client.post(url, payload, HTTP_STRIPE_SIGNATURE="testsignature")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
