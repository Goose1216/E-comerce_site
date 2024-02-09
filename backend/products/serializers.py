from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name",)
        model = Category


class ProductSerializerList(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)

    class Meta:
        fields = ('name', 'slug', 'price', 'brand', 'category', 'image')
        model = Product


class ProductSerializerDetail(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)

    class Meta:
        fields = ('name', 'slug', 'price', 'brand', 'category', 'image', 'height', "width", 'depth')
        lookup_field = 'slug'
        model = Product


