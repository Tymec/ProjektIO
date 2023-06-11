import tempfile

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APIRequestFactory

from app.models import Order, OrderItem, Product, Review

pytestmark = pytest.mark.django_db
User = get_user_model()


@pytest.fixture
def user():
    user = User.objects.create_user(
        email="test@user.com",
        password="testpass",
        first_name="Test",
        last_name="User",
    )
    return user


@pytest.fixture
def superuser():
    admin = User.objects.create_superuser(
        email="test@admin.com",
        password="testpass",
        first_name="Test",
        last_name="Admin",
    )
    return admin


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def api_factory():
    return APIRequestFactory()


@pytest.fixture
def image():
    return tempfile.NamedTemporaryFile(suffix=".jpg").name


@pytest.fixture
def sample_product(image):
    return Product.objects.create(
        name="Test Product", price=10, image=image, countInStock=10
    )


@pytest.fixture
def sample_review(user, sample_product):
    return Review.objects.create(
        user=user, product=sample_product, rating=5, comment="Test comment"
    )


@pytest.fixture
def sample_order(user, sample_product):
    return Order.objects.create(user=user)


@pytest.fixture
def sample_order_item(sample_order, sample_product):
    return OrderItem.objects.create(
        order=sample_order, product=sample_product, quantity=1
    )
