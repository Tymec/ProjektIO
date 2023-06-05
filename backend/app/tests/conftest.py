import os
import sqlite3

import pytest
from django.core.management import call_command


@pytest.fixture(scope="session")
def django_db_setup(django_db_blocker):
    from django.conf import settings

    settings.DATABASES["default"] = {
        "NAME": ":memory:",
        "ENGINE": "django.db.backends.sqlite3",
    }

    settings.MEDIA_URL = "/media/"
    settings.MEDIA_ROOT = settings.BASE_DIR / "media"
    settings.STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.InMemoryStorage"}
    }

    with django_db_blocker.unblock():
        call_command("migrate", "--noinput")
