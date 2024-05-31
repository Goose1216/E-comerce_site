from django.urls import path
from .views import OrderList, OrderCreate, CartItemsAdd, CartItemsUpdate, CartItemsRemove, CartItemsList

urlpatterns = [
    path('order/create/', OrderCreate.as_view(), name='order_list'),
    path('order/list/', OrderList.as_view(), name='order_create'),
    path('cart/add/', CartItemsAdd.as_view(), name='add_to_cart'),
    path('cart/update/<int:pk>/', CartItemsUpdate.as_view(), name='update_cart'),
    path('cart/remove/<int:pk>/', CartItemsRemove.as_view(), name='remove_from_cart'),
    path('cart/', CartItemsList.as_view(), name='cart_list'),
]
