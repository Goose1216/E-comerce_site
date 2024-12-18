import json
import datetime

from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail, CartItemSerializer
from drf_spectacular.utils import extend_schema
from django.db.models import Q, F, Func


@extend_schema(summary="Отображает список всех товаров")
class ProductList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = ProductSerializerList

    def get_queryset(self):
        queryset = Product.objects.all()

        query = self.request.query_params.get("q")
        if query:
            queryset = self.search_products(queryset, query)

        brand = self.request.query_params.get("brand")
        if brand:
            queryset = self.filter_by_brand(queryset, brand)

        category = self.request.query_params.get('category')
        if category:
            queryset = self.filter_by_category(queryset, category)

        price = self.request.query_params.get("price")
        if price:
            queryset = self.filter_by_price(queryset, price)

        sort_by = self.request.query_params.get("sort")
        group_by = self.request.query_params.get("group")
        if sort_by and group_by:
            queryset = self.sort_results(queryset, group_by, sort_by)
        elif sort_by and not group_by:
            queryset = self.sort_results(queryset, sort_by)
        elif group_by:
            queryset = self.sort_results(queryset, group_by)

        queryset = queryset.select_related("brand")
        return queryset

    @staticmethod
    def search_products(queryset, query):
        # Несмотря на icontains запрос регистрочувствительный
        return queryset.filter(
            Q(name__icontains=query) |
            Q(brand__name__icontains=query)
        )

    @staticmethod
    def filter_by_brand(queryset, brand):
        brands = map(lambda x: x.lower(), brand.split('-'))
        return queryset.annotate(brand_lower=Func(F("brand__name"), function="LOWER")).filter(brand_lower__in=brands)

    @staticmethod
    def filter_by_category(queryset, category):
        categories = category.split("-")
        return queryset.filter(category__name_latinica__in=categories).distinct()

    @staticmethod
    def filter_by_price(queryset, price):
        min_price, max_price = map(int, price.split('-'))
        return queryset.filter(price__range=(min_price, max_price))

    @staticmethod
    def sort_results(queryset, *args):
        return queryset.order_by(*args)


@extend_schema(summary="Отображает один конкретный товар")
class ProductDetail(generics.RetrieveAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail
    lookup_field = 'slug'


@extend_schema(summary="Отображает список товаров с категорией 'новинка' или с скидкой")
class ProductMain(generics.ListAPIView):
    pagination_class = None
    serializer_class = ProductSerializerList
    permission_classes = (IsAdminOrReadOnly,)

    def get_queryset(self):
        queryset_new = Product.objects.filter(Q(category__name="Новинка")).order_by('price')[:24]
        queryset_discount = Product.objects.filter(Q(discount__gt=0)).order_by('-discount')[:21]
        queryset = (queryset_new | queryset_discount).order_by('-discount')
        return queryset


@extend_schema(summary="Точка для добавления товаров в корзину")
class AddToCartView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            "Добавить в будущем проверку, что на складе есть товар"
            data = request.data
            pk = data['product']
            cart = json.loads(request.COOKIES.get('cart', '[]'))
            iter_cart = iter(cart)
            is_append = True
            while True:
                try:
                    item = next(iter_cart)
                    if item['product'] == pk:
                        item['count'] += 1
                        response = Response({'message': 'Товар Обновлён'}, status=204)
                        is_append = False
                        break
                except StopIteration:
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
