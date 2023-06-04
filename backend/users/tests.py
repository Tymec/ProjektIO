import pytest
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
from django.urls import reverse

# Database tests
User = get_user_model()


@pytest.mark.django_db
def test_user_create():
    User.objects.create_user("john.doe@gmail.com", "johndoe12345")
    assert User.objects.count() == 1


@pytest.mark.django_db
def test_user_create_superuser():
    User.objects.create_superuser("admin@admin.com", "admin12345")
    assert User.objects.count() == 1
    assert User.objects.get().is_superuser is True
    assert User.objects.get().is_staff is True


@pytest.mark.django_db
def test_user_create_fail():
    User.objects.create_user("john.doe@gmail.com", "johndoe12345")
    with pytest.raises(IntegrityError):
        User.objects.create_superuser("john.doe@gmail.com", "anotherjoedoe12345")
