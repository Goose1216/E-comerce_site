from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from products.models import Product
from django.urls import reverse

import uuid

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

    @classmethod
    def create(cls, user, email, phone_number, cart_id):
        obj = cls(user=user, email=email, phone_number=phone_number)
        queryset = CartItem.objects.filter(cart_id=cart_id).filter(order=None)
        print(queryset)
        return obj

    def __str__(self):
        return f"Заказ номер {self.pk}, Заказчик - {self.user}"

    @property
    def get_total_price(self):
        return sum(x.get_total_price for x in self.cartItems.all())

    # def get_absolute_url(self):
    #    return None


class CartItem(models.Model):
    order = models.ForeignKey(Order, blank=True, null=True, on_delete=models.CASCADE, related_name='cartItems',
                              verbose_name="Заказ")
    cart_id = models.UUIDField(default=uuid.uuid4)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cartItems', verbose_name='Товар')
    quantity = models.PositiveIntegerField(blank=True, default=1, db_index=True, verbose_name="Количество товара")

    class Meta:
        default_related_name = 'cartItems'
        verbose_name = "Товар в корзине"
        verbose_name_plural = "Товары в корзине"

    def __str__(self):
        return self.product.name + " - " + str(self.quantity) + " штуки"

    def get_absolute_url(self):
        return reverse('cart_list', args={'uuid': self.cart_id})

    @property
    def get_total_price(self):
        return self.product.price * self.quantity
