import json
import datetime

from django.http import JsonResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import CartItemSerializer
from products.models import Product


@extend_schema(summary="Точка для добавления товаров в корзину")
class AddToCartView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            "Добавить в будущем проверку, что на складе есть товар"
            data = request.data
            pk = data['product']
            cart = json.loads(request.COOKIES.get('cart', '[]'))
            is_append = True
            for item in cart:
                if item['product'] == pk:
                    item['count'] += 1
                    response = Response({'message': 'Товар Обновлён'}, status=204)
                    is_append = False
                    break
            if is_append:
                cart.append(data)
                response = Response({'message': 'Товар добавлен'}, status=200)
            week = datetime.datetime.now() + datetime.timedelta(days=7)
            response.set_cookie('cart', json.dumps(cart), max_age=week.timestamp())
        except:
            response = Response({"message": "Ошибка запроса"}, status=400)
        return response


@extend_schema(summary="Точка для получения товаров корзины")
@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    try:
        cart = json.loads(request.COOKIES.get('cart', '[]'))
        answer_cart = []
        if cart:
            for cart_item in cart:
                pk = cart_item['product']
                count_item = int(cart_item['count'])
                cart_serialize = CartItemSerializer(Product.objects.get(pk=pk), count=count_item)
                cart_data = cart_serialize.data
                answer_cart.append(cart_data)
        return JsonResponse(answer_cart, status=200, safe=False)
    except:
        return Response({"message": "Ошибка запроса"}, status=400)


@extend_schema(summary="Точка для удаления товаров с корзины")
class DeleteCartView(APIView):
    permission_classes = (AllowAny,)

    def delete(self, request):
        try:
            pk_for_delete = request.data['product']
            cart = json.loads(request.COOKIES.get('cart', '[]'))
            old_len = len(cart)
            if cart:
                cart = list(filter(lambda x: x['product'] != pk_for_delete, cart))
                new_len = len(cart)
                if old_len - 1 == new_len:
                    response = Response({'message': 'Товар удалён'}, status=200)
                else:
                    response = Response({'message': 'Ничего не было удалено'}, status=204)
            else:
                response = Response({'message': 'Корзина пустая'}, status=204)
            week = datetime.datetime.now() + datetime.timedelta(days=7)
            response.set_cookie('cart', json.dumps(cart), max_age=week.timestamp())
        except:
            response = Response({"message": "Ошибка запроса"}, status=400)
        return response


@extend_schema(summary="Точка для обновления товаров в корзине, изменение количества товаров")
class UpdateCartView(APIView):
    permission_classes = (AllowAny,)

    def put(self, request):
        try:
            pk_for_update = request.data['product']
            new_count = request.data['new_count']
            cart = json.loads(request.COOKIES.get('cart', '[]'))
            iter_cart = iter(cart)
            is_update = False
            while True:
                try:
                    item = next(iter_cart)
                    if new_count < 1:
                        raise Exception
                    if item['product'] == pk_for_update:
                        item['count'] = new_count
                        response = Response({'message': 'Количество товара обновлено'}, status=200)
                        is_update = True
                        break
                except StopIteration:
                    break
            if not is_update:
                response = Response({'message': 'Товар не был обновлён'}, status=204)
            week = datetime.datetime.now() + datetime.timedelta(days=7)
            response.set_cookie('cart', json.dumps(cart), max_age=week.timestamp())
        except:
            response = Response({"message": "Ошибка запроса"}, status=400)
        return response
