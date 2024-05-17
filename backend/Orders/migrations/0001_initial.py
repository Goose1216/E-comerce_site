# Generated by Django 3.2.24 on 2024-05-09 15:22

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sessions', '0001_initial'),
        ('products', '0004_auto_20240403_1418'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, verbose_name='E-mai')),
                ('phone_number', models.CharField(max_length=12, validators=[django.core.validators.RegexValidator(regex='^(\\+7|8)([0-9]{10})$')], verbose_name='Номер телефона')),
                ('date_ordered', models.DateTimeField(auto_now_add=True, verbose_name='Дата формирования')),
                ('status', models.CharField(blank=True, choices=[('1', 'В сборке'), ('2', 'Собран'), ('3', 'Отправлен'), ('4', 'Доставлен'), ('5', 'Отменён')], default='1', max_length=50, verbose_name='Статус')),
                ('transaction_id', models.CharField(blank=True, max_length=100, null=True, verbose_name='id для доставки')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Заказ',
                'verbose_name_plural': 'Заказы',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(blank=True, db_index=True, default=0, verbose_name='Количество товара')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cartItems', to='Orders.order', verbose_name='Заказ')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartItems', to='products.product', verbose_name='Товар')),
                ('session', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cartItems', to='sessions.session', verbose_name='Сессия')),
            ],
            options={
                'verbose_name': 'Товар в корзине',
                'verbose_name_plural': 'Товары в корзине',
                'default_related_name': 'cartItems',
            },
        ),
    ]