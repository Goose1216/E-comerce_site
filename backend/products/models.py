import math

from django.db import models
from django.conf import settings
from django.urls import reverse
from django.template.defaultfilters import slugify

Rate = (
    ('1', 'Ужасно'),
    ('2', 'Плохо'),
    ('3', 'Удовлетворительно'),
    ('4', 'Хорошо'),
    ('5', 'Отлично')
)


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название бренда")

    # rate - рейтинг всех товаров продавца средний

    class Meta:
        default_related_name = "brands"
        verbose_name = "Бренд"
        verbose_name_plural = "Бренды"

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Категория")

    class Meta:
        default_related_name = "categories"
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True, verbose_name='Название товара')
    slug = models.SlugField(editable=False)
    discount = models.PositiveIntegerField(default=0, verbose_name="Скидка в процентах")
    price = models.PositiveIntegerField(db_index=True, verbose_name="Цена")
    image = models.ImageField(upload_to='covers', blank=True, null=True, verbose_name="Изображение")
    height = models.PositiveSmallIntegerField(blank=True, null=True)
    depth = models.PositiveSmallIntegerField(blank=True, null=True)
    width = models.PositiveSmallIntegerField(blank=True, null=True)
    brand = models.ForeignKey(Brand, null=True, on_delete=models.SET_NULL, verbose_name='Бренд')
    category = models.ManyToManyField(Category, verbose_name='Категория')

    class Meta:
        ordering = ['name', ]
        default_related_name = 'products'
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('product_detail', args={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def get_price(self):
        return math.ceil(self.price * ((100 - self.discount) / 100))


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name='Товар')
    review = models.TextField(blank=True, null=True, verbose_name='Отзыв')
    date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, verbose_name='Автор')
    rate = models.CharField(max_length=50, choices=Rate, default="5", verbose_name='Рейтинг')

    class Meta:
        ordering = ['-rate', ]
        default_related_name = 'reviews'
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return "Комментарий для " + self.product.name

    def get_absolute_url(self):
        return Product.objects.get(pk=self.product.pk).get_absolute_url()
