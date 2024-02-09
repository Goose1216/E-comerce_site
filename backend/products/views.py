from rest_framework import generics
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail


class ProductList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerList


class ProductDetail(generics.RetrieveAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail
    lookup_field = 'slug'
