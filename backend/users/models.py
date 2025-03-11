from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class CustomUser(AbstractUser):
    phone_regex = RegexValidator(regex=r'^(?:\+7|8)\d{10}$',
                                 message="Телефонный номер должен иметь вид: '(+7/8)1234567890'")
    phone_number = models.CharField(validators=[phone_regex], max_length=12, blank=True, null=True, editable=True, unique=True)
