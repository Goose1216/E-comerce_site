from rest_framework import serializers
from .models import Product, Category, CartItem


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


class CartItemSerializerList(serializers.ModelSerializer):
    product = ProductSerializerDetail(many=False)
    get_total_price = serializers.ReadOnlyField()

    class Meta:
        fields = ('pk', 'product', 'quantity', 'cart_id', 'get_total_price')
        model = CartItem


class CartItemSerializerUpdate(serializers.ModelSerializer):

    class Meta:
        fields = ('quantity', )
        model = CartItem


class CartItemSerializerAll(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = CartItem

