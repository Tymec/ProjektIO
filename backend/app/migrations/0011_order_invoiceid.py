# Generated by Django 4.2.2 on 2023-06-08 15:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0010_shippingaddress_order_paymentintentid_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="invoiceId",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]