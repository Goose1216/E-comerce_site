# Generated by Django 3.2.24 on 2024-04-02 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_product_discount'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='price_standart',
            field=models.PositiveIntegerField(default=0, verbose_name='Цена стандартная'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.PositiveIntegerField(db_index=True, editable=False, verbose_name='Цена конечная'),
        ),
    ]
