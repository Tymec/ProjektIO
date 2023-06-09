from django.conf import settings
from django.db import models


class Customer(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True
    )

    stripeCustomerId = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return str(self._id)
