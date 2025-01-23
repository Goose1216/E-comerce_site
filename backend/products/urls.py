from django.urls import path
from .views import ProductList, ProductDetail, ProductMain, ReviewCreate, ReviewList
urlpatterns = [
    path('main/', ProductMain.as_view(), name='product_main'),
    path('list/', ProductList.as_view(), name='product_list'),
    path('<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
    path("reviews/create/", ReviewCreate.as_view(), name='review_create'),
    path("reviews/list/", ReviewList.as_view(), name='review_list'),
]
