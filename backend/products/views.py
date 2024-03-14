from rest_framework import generics
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail
from drf_spectacular.utils import extend_schema


@extend_schema(summary="Отображает список всех товаров")
class ProductList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerList


@extend_schema(summary="Отображает один конкретный товар")
class ProductDetail(generics.RetrieveAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail
    lookup_field = 'slug'
