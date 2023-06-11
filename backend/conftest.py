import pytest
from django.core.management import call_command


@pytest.fixture(scope="session")
def django_db_setup(django_db_blocker):
    from django.conf import settings

    settings.DATABASES["default"] = {
        "NAME": ":memory:",
        "ENGINE": "django.db.backends.sqlite3",
        "ATOMIC_REQUESTS": True,
    }

    settings.MEDIA_URL = "/media/"
    settings.MEDIA_ROOT = settings.BASE_DIR / "media"
    settings.STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.InMemoryStorage"}
    }

    with django_db_blocker.unblock():
        call_command("migrate", "--noinput")


def pytest_configure(config):
    pass


pytest_plugins = [
    "tests.fixtures",
    "tests.db_tests",
]
