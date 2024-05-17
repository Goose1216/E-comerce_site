from django.urls import path
from .views import ProductList, ProductDetail, ProductMain, CartItemsAdd, CartItemsList, CartItemsRemove, CartItemsUpdate
urlpatterns = [
    path('product/main/', ProductMain.as_view(), name='product_main'),
    path('product/list/', ProductList.as_view(), name='product_list'),
    path('product/<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
    path('cart/add/', CartItemsAdd.as_view(), name='add_to_cart'),
    path('cart/update/<int:pk>/', CartItemsUpdate.as_view(), name='update_cart'),
    path('cart/remove/<int:pk>/', CartItemsRemove.as_view(), name='remove_from_cart'),
    path('cart/', CartItemsList.as_view(), name='cart_list'),


]
