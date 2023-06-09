from django.apps import AppConfig


# mypy: ignore-errors
class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"
