import pytest
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

pytestmark = pytest.mark.django_db
User = get_user_model()


@pytest.fixture
def user_count():
    user_count = User.objects.count()
    yield user_count
    assert User.objects.count() == user_count + 1


def test_user_create(user_count):
    user = User.objects.create_user("user@test.com", "testuser12345")

    assert user.is_superuser is False
    assert user.is_staff is False


def test_user_create_superuser(user_count):
    user = User.objects.create_superuser("admin@test.com", "testadmin12345")

    assert user.is_superuser is True
    assert user.is_staff is True


def test_user_create_fail():
    user1 = User.objects.create_user("user@test.com", "testuser12345")
    with pytest.raises(IntegrityError):
        user2 = User.objects.create_superuser("user@test.com", "testuser67890")
