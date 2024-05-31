from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name", "name_latinica")
        model = Category


class ProductSerializerList(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('pk', 'name', 'slug', 'price_standart', "discount", "price", 'brand', 'category', 'image')
        model = Product


class ProductSerializerDetail(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('pk', 'name', 'slug', 'price_standart', "discount", "price", 'brand', 'category', 'image',
                  'height', "width", 'depth')
        lookup_field = 'slug'
        model = Product

