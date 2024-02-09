from rest_framework import generics
from .models import Product
from .serializers import ProductSerializerList, ProductSerializerDetail


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializerList


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail
    lookup_field = 'slug'
