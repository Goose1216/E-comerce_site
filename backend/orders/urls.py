from django.urls import path
from .views import OrderList, create_order, OrderDetail

urlpatterns = [
    path("create/", create_order, name='orders_create'),
    path("list/", OrderList.as_view(), name='orders_list'),
    path("<uuid:uuid>/", OrderDetail.as_view(), name='orders_detail'),
]