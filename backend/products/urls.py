from django.urls import path
from .views import ProductList, ProductDetail, ProductMain
urlpatterns = [
    path('main/', ProductMain.as_view(), name='product_main'),
    path('list/', ProductList.as_view(), name='product_list'),
    path('<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
]
