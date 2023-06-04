from django.contrib.auth import get_user_model
from django.db.models.signals import pre_save
from django.dispatch import receiver

# Create your signals here.
User = get_user_model()


def update_user(sender, instance, **kwargs):
    # Update user's email address to lowercase.
    if instance.email:
        instance.email = instance.email.lower()


pre_save.connect(update_user, sender=User)
