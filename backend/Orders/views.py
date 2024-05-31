from rest_framework import generics
from .permissions import IsAdminOrReadOnly, IsAdminOrReadOnlyAndPost, IsAdminOrReadOnlyAndDelete, IsAdminOrReadOnlyAndPut
from .serializers import OrderSerializerAll, CartItemSerializerAll, CartItemSerializerUpdate, CartItemSerializerList
from .models import Order, CartItem
from products.models import Product
from drf_spectacular.utils import extend_schema

import uuid


@extend_schema(summary="Отображает все заказы для текущего пользователя")
class OrderList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = OrderSerializerAll
    pagination_class = None

    def get_queryset(self):
        queryset = Order.objects.filter(user=self.request.user)
        return queryset


@extend_schema(summary="Формирует заказ")
class OrderCreate(generics.CreateAPIView):
    permission_classes = (IsAdminOrReadOnlyAndPost,)
    serializer_class = OrderSerializerAll

    def perform_create(self, serializer):
        user = self.request.user
        email = 'goose1216@yandex.ru'
        phone_number = "+79965159935"
        cart_id = 'ae39b6eb-7b29-47b9-9a6a-d7baeb249956'
        order = Order.create(user, email, phone_number, cart_id)
        order.save()
        cartItems = CartItem.objects.filter(cart_id='ae39b6eb-7b29-47b9-9a6a-d7baeb249956').filter(order=None)
        for item in cartItems:
            item.order = order
            item.save()


@extend_schema(summary="Отображает все элементы корзины для текущей сессии")
class CartItemsList(generics.ListAPIView):
    pagination_class = None
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = CartItemSerializerList

    def get_queryset(self):
        queryset = CartItem.objects.filter(cart_id=self.request.query_params['cart_id']).filter(order=None)
        return queryset


@extend_schema(summary="Добавляет предметы в корзину")
class CartItemsAdd(generics.CreateAPIView):
    permission_classes = (IsAdminOrReadOnlyAndPost,)
    serializer_class = CartItemSerializerAll

    def perform_create(self, serializer):

        try:
            obj = CartItem.objects.get(cart_id=self.request.data['cart_id'],
                                       product=Product.objects.get(pk=self.request.data['product']),
                                       order__isnull=True,
                                       )
            print(obj)
            quantity = self.request.data['quantity']
            quantity = 1 if quantity == '' else quantity
            obj.quantity += int(quantity)
            obj.save()
        except:
            cart_id = self.request.data['cart_id']
            cart_id = uuid.uuid4() if cart_id == '' else cart_id
            quantity = self.request.data['quantity']
            quantity = 1 if quantity == '' else quantity
            serializer.save(cart_id=cart_id,
                            product=Product.objects.get(pk=self.request.data['product']),
                            quantity=quantity)


@extend_schema(summary="Удаляет предметы из корзины")
class CartItemsRemove(generics.DestroyAPIView):
    permission_classes = (IsAdminOrReadOnlyAndDelete,)
    serializer_class = CartItemSerializerAll
    queryset = CartItem.objects.all()


@extend_schema(summary='Обновляет количество товаров в корзине')
class CartItemsUpdate(generics.UpdateAPIView):
    permission_classes = (IsAdminOrReadOnlyAndPut, )
    serializer_class = CartItemSerializerUpdate
    queryset = CartItem.objects.all()
