# Generated by Django 3.2.24 on 2025-03-02 11:19

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_customuser_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone_number',
            field=models.CharField(blank=True, max_length=12, null=True, validators=[django.core.validators.RegexValidator(message="Телефонный номер должен иметь вид: '+71234567890'", regex='^\\+7\\d{10}$')]),
        ),
    ]
