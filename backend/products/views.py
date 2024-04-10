from rest_framework import generics
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail
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
    permission_classes = (IsAdminOrReadOnly,)
    queryset_new = Product.objects.filter(Q(category__name="Новинка")).order_by('price')[:24]
    queryset_discount = Product.objects.filter(Q(discount__gt=0)).order_by('-discount')[:21]
    queryset = (queryset_new | queryset_discount).order_by('-discount')
    serializer_class = ProductSerializerList
