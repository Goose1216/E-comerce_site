from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name",)
        model = Category


class ProductSerializerList(serializers.ModelSerializer):
    price_discount = serializers.IntegerField(source="get_price")
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('name', 'slug', 'price', "discount", "price_discount", 'brand', 'category', 'image')
        model = Product


class ProductSerializerDetail(serializers.ModelSerializer):
    price_discount = serializers.IntegerField(source="get_price")
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('name', 'slug', 'price', "discount", "price_discount", 'brand', 'category', 'image', 'height', "width", 'depth')
        lookup_field = 'slug'
        model = Product

