# Generated by Django 3.2.24 on 2025-02-02 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_auto_20240403_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='total_rate',
            field=models.PositiveSmallIntegerField(default=0, editable=False, verbose_name='Средний рейтинг'),
        ),
    ]
