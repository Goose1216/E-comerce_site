from django.urls import path
from .views import ProductList, ProductDetail, ProductMain
urlpatterns = [
    path('product/main/', ProductMain.as_view(), name='product_main'),
    path('product/list/', ProductList.as_view(), name='product_list'),
    path('product/<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
]
