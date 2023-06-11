# Generated by Django 4.2.2 on 2023-06-10 20:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0001_initial"),
        ("extra", "0003_alter_chatconversationcontext_context"),
    ]

    operations = [
        migrations.AddField(
            model_name="imagegeneration",
            name="product",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="app.product",
            ),
        ),
    ]