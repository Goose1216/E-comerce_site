from django.urls import path
from .views import ProductList, ProductDetail, ProductCreate
urlpatterns = [
    path('', ProductList.as_view()),
    path('new/', ProductCreate.as_view()),
    path('<slug:slug>/', ProductDetail.as_view()),
]
