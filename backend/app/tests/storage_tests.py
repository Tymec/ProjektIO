import pytest
from app.models import Product

pytestmark = pytest.mark.django_db


@pytest.fixture
def product_count():
    product_count = Product.objects.count()
    yield product_count
    assert Product.objects.count() == product_count + 1


def test_add_product(product_count):
    product = Product.objects.create(
        name="Test Product",
        brand="Test Brand",
        category="Test Category",
        rating=4.5,
        price=100.00,
    )

    assert product.image.url == "/media/placeholder.png"
    assert product.name == "Test Product"
