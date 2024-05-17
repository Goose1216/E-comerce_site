import uuid

from rest_framework import generics
from .models import Product, CartItem
from .permissions import IsAdminOrReadOnly, IsAdminOrReadOnlyAndPost, IsAdminOrReadOnlyAndDelete, IsAdminOrReadOnlyAndPut
from .serializers import ProductSerializerList, ProductSerializerDetail, CartItemSerializerList, CartItemSerializerAll, CartItemSerializerUpdate
from drf_spectacular.utils import extend_schema
from django.db.models import Q, F, Func


@extend_schema(summary="Отображает список всех товаров")
class ProductList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnlyAndPost,)
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

        return queryset.select_related("brand")

    @staticmethod
    def search_products(queryset, query):
        return queryset.filter(
            Q(name__icontains=query) |
            Q(brand__name__icontains=query)
        )

    @staticmethod
    def filter_by_brand(queryset, brand):
        brands = brand.split('-')
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
    permission_classes = (IsAdminOrReadOnly,)
    queryset_new = Product.objects.filter(Q(category__name="Новинка")).order_by('price')[:24]
    queryset_discount = Product.objects.filter(Q(discount__gt=0)).order_by('-discount')[:21]
    queryset = (queryset_new | queryset_discount).order_by('-discount')
    serializer_class = ProductSerializerList


@extend_schema(summary="Отображает все элементы корзины для текущей сессии")
class CartItemsList(generics.ListAPIView):
    pagination_class = None
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = CartItemSerializerList

    def get_queryset(self):
        queryset = CartItem.objects.filter(cart_id=self.request.query_params['cart_id'])
        return queryset


@extend_schema(summary="Добавляет предметы в корзину")
class CartItemsAdd(generics.CreateAPIView):
    permission_classes = (IsAdminOrReadOnlyAndPost,)
    serializer_class = CartItemSerializerAll

    def perform_create(self, serializer):
        try:
            obj = CartItem.objects.get(cart_id=self.request.data['cart_id'],
                                       product=Product.objects.get(pk=self.request.data['product']))
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
