from django.urls import path
from .views import ProductList, ProductDetail, ProductMain, AddToCartView, DeleteCartView,UpdateCartView, get_cart
urlpatterns = [
    path('main/', ProductMain.as_view(), name='product_main'),
    path('list/', ProductList.as_view(), name='product_list'),
    path('<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
    path('cart/get/', get_cart, name='cart'),
    path('cart/set/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/delete/', DeleteCartView.as_view(), name='delete_from_cart'),
    path('cart/update/', UpdateCartView.as_view(), name='update_cart'),
]
