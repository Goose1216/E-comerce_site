# Generated by Django 3.2.24 on 2025-02-03 18:38

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0006_auto_20250203_1648'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='name_client',
            field=models.CharField(default=django.utils.timezone.now, max_length=100, verbose_name='ФИО заказчика'),
            preserve_default=False,
        ),
    ]
