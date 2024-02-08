from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name",)
        model = Category


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    
    class Meta:
        fields = ('name', 'slug', 'price', 'brand', 'category',)
        model = Product
