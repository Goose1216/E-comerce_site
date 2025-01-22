from django.urls import path
from .views import AddToCartView, DeleteCartView,UpdateCartView, get_cart
urlpatterns = [
    path('get/', get_cart, name='cart'),
    path('set/', AddToCartView.as_view(), name='add_to_cart'),
    path('delete/', DeleteCartView.as_view(), name='delete_from_cart'),
    path('update/', UpdateCartView.as_view(), name='update_cart'),
]
