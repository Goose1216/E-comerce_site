from rest_framework import generics
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail
from drf_spectacular.utils import extend_schema
from django.db.models import Q, F, Func


@extend_schema(summary="Отображает список всех товаров")
class ProductList(generics.ListAPIView):
    paginate_by = 50
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = ProductSerializerList

    def get_queryset(self):
        queryset = Product.objects.all()
        sort_by = self.request.query_params.get("sort")
        brand = self.request.query_params.get("brand")
        #category = self.request.query_params.get('category') - категории сделать английскими, иначе проблема с get запросами
        price = self.request.query_params.get("price")
        if sort_by:
            queryset = queryset.order_by(sort_by)
        if brand:
            queryset = queryset.annotate(brand_lower=Func(F("brand__name"), function="LOWER")).filter(brand_lower__in=brand.split('-'))
        #if category:
            #queryset = queryset.filter(category__name__in=category.split(","))
        if price:
            queryset = queryset.filter(price__gte=price.split('-')[0], price__lte=price.split("-")[-1])
        return queryset


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
