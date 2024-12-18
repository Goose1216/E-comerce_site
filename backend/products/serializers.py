from rest_framework import serializers
from .models import Product, Category, Brand


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name", "name_latinica")
        model = Category


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("name", )
        model = Brand


class ProductSerializerList(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('name', 'slug', 'price_standart', "discount", "price", 'brand', 'category', 'image', 'pk')
        model = Product


class ProductSerializerDetail(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    brand = serializers.StringRelatedField(many=False)

    class Meta:
        fields = ('name', 'slug', 'price_standart', "discount", "price", 'brand', 'category', 'image', 'height', "width", 'depth', 'pk')
        lookup_field = 'slug'
        model = Product


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('name', 'slug', 'price_standart', "price", 'image', 'pk')
        model = Product

    def __init__(self, *args, count, **kwargs):
        self.count = int(count)
        super().__init__(*args, **kwargs)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['count'] = self.count
        """        
        ДЛЯ ПРОДАКШЕНА ПОМЕНЯТЬ СТРОКУ НИЖЕ!!!
        Для Image почему-то пришлось явно указывать полный адрес, иначе фотка пыталась скачать с фронтенда
        """
        representation['image'] = 'http://127.0.0.1:8000' + representation['image']
        return representation

