from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator


User = get_user_model()
statuses = (
    ('1', 'В сборке'),
    ('2', "Собран"),
    ('3', "Отправлен"),
    ("4", "Доставлен"),
    ("5", 'Отменён')
)


class Order(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name='orders',
                             verbose_name='Пользователь')
    email = models.EmailField(verbose_name="E-mai")
    phoneNumberRegex = RegexValidator(regex=r'^(\+7|8)([0-9]{10})$')
    phone_number = models.CharField(validators=[phoneNumberRegex], max_length=12, verbose_name="Номер телефона")
    date_ordered = models.DateTimeField(auto_now_add=True, verbose_name="Дата формирования")
    status = models.CharField(blank=True, max_length=50, choices=statuses, default="1", verbose_name='Статус')
    transaction_id = models.CharField(max_length=100, null=True, blank=True, verbose_name="id для доставки")

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return f"Заказ номер {self.pk}, Заказчик - {self.user}"

    # def get_absolute_url(self):
    #    return None

