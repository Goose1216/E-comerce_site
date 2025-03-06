# Generated by Django 3.2.24 on 2025-02-22 15:32

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='phone_number',
            field=models.CharField(blank=True, max_length=11, null=True, validators=[django.core.validators.RegexValidator(message="Телефонный номер должен иметь вид: '+79787757143'", regex='^\\+7\\d{10}$')]),
        ),
    ]
