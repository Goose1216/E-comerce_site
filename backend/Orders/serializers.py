from rest_framework import serializers
from .models import Order, CartItem
from products.serializers import ProductSerializerDetail


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


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']


class OrderSerializerAll(serializers.ModelSerializer):
    cartItems = CartItemSerializerList(many=True, read_only=True)
    get_total_price = serializers.ReadOnlyField()
    status = serializers.CharField(source='get_status_display')

    class Meta:
        fields = ("pk", 'user', "phone_number", "email", "date_ordered", "status", "get_total_price", 'cartItems')
        model = Order

    def get_status_display(self, obj):
        return dict(Order.statuses)[obj.status]

