from rest_framework import generics, permissions
from .models import Product
from .permissions import IsAdminOrReadOnly
from .serializers import ProductSerializerList, ProductSerializerDetail


class ProductList(generics.ListAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerList

class ProductCreate(generics.CreateAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializerDetail
    lookup_field = 'slug'
