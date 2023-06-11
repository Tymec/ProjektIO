from unittest import mock

import pytest
from django.urls import reverse
from rest_framework.request import Request

from app.backends import NumberedPaginationBackend
from app.middlewares import DebugRequestsMiddleware
from app.models import Product, Review
from app.utils import upload_to

pytestmark = pytest.mark.django_db


def test_utils_upload_to():
    filename = upload_to(None, "test.png")
    assert len(filename) == 40
    assert filename.endswith(".png")


def test_backend_numbered_pagination(api_factory):
    paginator = NumberedPaginationBackend()
    paginator.page_size = 10

    request = Request(api_factory.get("/"))

    products = Product.objects.all().order_by("_id")
    queryset = list(paginator.paginate_queryset(products, request))
    result = paginator.get_paginated_response(queryset)

    data = result.data
    assert "next" in data["links"]
    assert "previous" in data["links"]
    assert "count" in data["pagination"]
    assert "page" in data["pagination"]
    assert "pages" in data["pagination"]
    assert "per_page" in data["pagination"]
    assert "results" in data


def test_middleware_debug_requests_middleware(api_factory):
    get_response = mock.MagicMock()
    request = Request(api_factory.get("/"))

    middleware = DebugRequestsMiddleware(get_response)
    response = middleware(request)

    assert get_response.return_value == response


def test_list_products(api_client):
    response = api_client.get(reverse("product-list"))

    assert response.status_code == 200
    assert response.data
    assert "results" in response.data
    assert "pagination" in response.data
    assert "links" in response.data


def test_list_products_by_ids(api_client):
    Product.objects.all().delete()

    product1 = Product.objects.create(
        name="product1",
        price=1,
        rating=1,
    )
    product2 = Product.objects.create(
        name="product2",
        price=1,
        rating=1,
    )

    response = api_client.get(
        reverse("product-list"),
        {"ids": f"{product1._id},{product2._id}"},
    )

    assert response.status_code == 200
    assert response.data
    assert len(response.data["results"]) == 2
    assert response.data["results"][0]["name"] == "product1"
    assert response.data["results"][1]["name"] == "product2"


@pytest.mark.parametrize(
    "search,order_by,first_result",
    [
        ("", "-price", "expensive"),
        ("group_c", "", "best"),
        ("group_b", "price", "latest"),
        ("group_c", "-price,rating", "expensive"),
    ],
)
def test_filtering_products(api_client, search, order_by, first_result):
    Product.objects.all().delete()

    Product.objects.create(
        name="best",
        category="group_c",
        price=1,
        rating=5,
    )
    Product.objects.create(
        name="expensive",
        category="group_b group_c",
        price=3,
        rating=1,
    )
    Product.objects.create(
        name="latest",
        category="group_b",
        price=1,
        rating=1,
    )

    response = api_client.get(
        reverse("product-list"),
        {
            "search": search,
            "ordering": order_by,
        },
    )

    assert response.status_code == 200
    assert response.data
    assert response.data["results"][0]["name"] == first_result


def test_detail_product(api_client, sample_product):
    response = api_client.get(reverse("product-detail", args=[sample_product._id]))

    assert response.status_code == 200
    assert response.data
    assert response.data["_id"] == str(sample_product._id)


def test_create_product(api_client, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.post(
        reverse("product-list"),
        data={
            "name": "Test Product",
            "brand": "Test Brand",
            "category": "Test Category",
            "description": "Test Description",
            "price": 10,
            "countInStock": 10,
        },
    )

    assert response.status_code == 201
    assert response.data["image"].endswith("/media/placeholder.png")
    assert response.data["name"] == "Test Product"


def test_update_product(api_client, superuser, sample_product):
    api_client.force_authenticate(superuser)

    response = api_client.put(
        reverse("product-detail", args=[sample_product._id]),
        data={
            "name": "Updated Product",
            "brand": "Updated Brand",
            "category": "Updated Category",
            "description": "Updated Description",
            "price": 20,
            "countInStock": 20,
        },
    )

    assert response.status_code == 200
    assert response.data["name"] == "Updated Product"


def test_delete_product(api_client, superuser, sample_product):
    api_client.force_authenticate(superuser)

    response = api_client.delete(reverse("product-detail", args=[sample_product._id]))

    assert response.status_code == 204
    assert response.data is None


@pytest.mark.parametrize(
    "hasBought",
    [True, False],
)
def test_has_user_bought_product(api_client, user, sample_order_item, hasBought):
    if hasBought:
        api_client.force_authenticate(user)

    response = api_client.get(
        reverse("product-hasUserBought", args=[sample_order_item.product._id])
    )

    assert response.status_code == 200
    assert response.data["hasBought"] is hasBought


def test_list_reviews(api_client):
    response = api_client.get(reverse("review-list"))

    assert response.status_code == 200
    assert response.data
    assert "results" in response.data
    assert "pagination" in response.data
    assert "links" in response.data


@pytest.mark.parametrize(
    "search,order_by,first_result",
    [
        ("lowest", "", "lowest"),
        ("lowest", "-rating", "lowest"),
        ("", "-rating", "highest"),
        ("", "rating,-createdAt", "latest"),
    ],
)
def test_filtering_reviews(api_client, sample_product, search, order_by, first_result):
    Review.objects.all().delete()

    Review.objects.create(
        name="highest",
        product=sample_product,
        rating=5,
    )
    Review.objects.create(
        name="lowest",
        product=sample_product,
        rating=1,
    )
    Review.objects.create(
        name="latest",
        product=sample_product,
        rating=1,
    )

    response = api_client.get(
        reverse("review-list"),
        {
            "search": search,
            "ordering": order_by,
        },
    )

    assert response.status_code == 200
    assert response.data
    assert response.data["results"][0]["name"] == first_result


def test_detail_review(api_client, sample_review):
    response = api_client.get(reverse("review-detail", args=[sample_review._id]))

    assert response.status_code == 200
    assert response.data
    assert response.data["_id"] == str(sample_review._id)


def test_create_review(api_client, user, sample_product):
    api_client.force_authenticate(user)

    response = api_client.post(
        reverse("review-list"),
        data={
            "name": "Test Name",
            "product": sample_product._id,
            "rating": 5,
            "comment": "Test Comment",
        },
    )

    assert response.status_code == 201
    assert response.data["product"] == str(sample_product._id)
    assert response.data["rating"] == 5
    assert response.data["comment"] == "Test Comment"


def test_update_review(api_client, user, sample_review):
    api_client.force_authenticate(user)

    response = api_client.put(
        reverse("review-detail", args=[sample_review._id]),
        data={
            "name": "Updated Name",
            "product": sample_review.product._id,
            "rating": 4,
            "comment": "Updated Comment",
        },
    )

    assert response.status_code == 200
    assert response.data["rating"] == 4
    assert response.data["comment"] == "Updated Comment"


def test_delete_review(api_client, superuser, sample_review):
    api_client.force_authenticate(superuser)

    response = api_client.delete(reverse("review-detail", args=[sample_review._id]))

    assert response.status_code == 204
    assert response.data is None


def test_me_reviews(api_client, user, sample_review):
    api_client.force_authenticate(user)

    response = api_client.get(reverse("review-me"))

    assert response.status_code == 200
    assert response.data
    assert response.data[0]["_id"] == str(sample_review._id)


def test_list_orders(api_client, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(reverse("order-list"))

    assert response.status_code == 200
    assert response.data
    assert "results" in response.data
    assert "pagination" in response.data
    assert "links" in response.data


def test_detail_order(api_client, sample_order, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(reverse("order-detail", args=[sample_order._id]))

    assert response.status_code == 200
    assert response.data
    assert response.data["_id"] == str(sample_order._id)


def test_create_order(api_client, user, sample_product):
    api_client.force_authenticate(user)

    response = api_client.post(
        reverse("order-list"),
        data={"user": user.id},
    )

    assert response.status_code == 201
    assert response.data["user"] == str(user.id)


def test_update_order(api_client, superuser, sample_order):
    api_client.force_authenticate(superuser)

    response = api_client.put(
        reverse("order-detail", args=[sample_order._id]),
        data={
            "sessionId": "test_session_id",
        },
    )

    assert response.status_code == 200
    assert response.data["sessionId"] == "test_session_id"


def test_delete_order(api_client, superuser, sample_order):
    api_client.force_authenticate(superuser)

    response = api_client.delete(reverse("order-detail", args=[sample_order._id]))

    assert response.status_code == 204
    assert response.data is None


def test_me_orders(api_client, user, sample_order):
    api_client.force_authenticate(user)

    response = api_client.get(reverse("order-me"))

    assert response.status_code == 200
    assert response.data
    assert response.data[0]["_id"] == str(sample_order._id)


def test_deliver_order(api_client, superuser, sample_order):
    api_client.force_authenticate(superuser)

    response = api_client.put(
        reverse("order-deliver", args=[sample_order._id]),
    )

    assert response.status_code == 200
    assert response.data["message"] == "Order was delivered"


def test_list_order_items(api_client, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(reverse("order-item-list"))

    assert response.status_code == 200
    assert response.data
    assert "results" in response.data
    assert "pagination" in response.data
    assert "links" in response.data


def test_detail_order_item(api_client, sample_order_item, superuser):
    api_client.force_authenticate(superuser)

    response = api_client.get(
        reverse("order-item-detail", args=[sample_order_item._id])
    )

    assert response.status_code == 200
    assert response.data
    assert response.data["_id"] == str(sample_order_item._id)


def test_create_order_item(api_client, user, sample_product, sample_order):
    api_client.force_authenticate(user)

    response = api_client.post(
        reverse("order-item-list"),
        data={
            "product": sample_product._id,
            "order": sample_order._id,
            "qty": 1,
        },
    )

    print(response.data)
    assert response.status_code == 201
    assert response.data["product"]["_id"] == str(sample_product._id)
    assert response.data["order"] == str(sample_order._id)
    assert response.data["quantity"] == 1


def test_update_order_item(api_client, superuser, sample_order_item):
    api_client.force_authenticate(superuser)

    response = api_client.put(
        reverse("order-item-detail", args=[sample_order_item._id]),
        data={
            "product": sample_order_item.product._id,
            "order": sample_order_item.order._id,
            "quantity": 2,
        },
    )

    assert response.status_code == 200
    assert response.data["quantity"] == 2


def test_delete_order_item(api_client, superuser, sample_order_item):
    api_client.force_authenticate(superuser)

    response = api_client.delete(
        reverse("order-item-detail", args=[sample_order_item._id])
    )

    assert response.status_code == 204
    assert response.data is None
