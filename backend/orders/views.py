import json

from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.decorators import permission_classes, api_view
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from .serializers import OrderListSerializer, OrderDetailSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
import datetime
from products.models import Product


@extend_schema(summary="Конечная точка создания заказов")
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = json.loads(request.body)
        phone = data['phone']
        email = data['email']
        name_client = data['name_client']
        address = data['address']
        cart = request.COOKIES.get('cart')
        if cart is None:
            return Response({'message': 'Корзина пуста'}, status=400)

        cart_items = json.loads(cart)
        order = Order(client=request.user, phone=phone, email=email, name_client=name_client, address=address)
        order.save()

        for item in cart_items:
            product = Product.objects.filter(pk=item['product']).first() # Сделано, чтоб в случае отсутсвия товара не возникал Exception
            if product is None:
                order.delete()
                return Response({'message': 'Товар отсутствует'}, status=400)
            order_item = OrderItem(product=product, order=order, count=item['count'])
            order_item.save()
        order.save()

        response = Response({'message': 'OK'}, status=201)
        week = datetime.datetime.now() + datetime.timedelta(days=7)
        cart = []
        response.set_cookie('cart', json.dumps(cart), max_age=week.timestamp())
        return response
    except:
        if 'order' in locals():
            order.delete()
        return Response({'message': 'Oшибка'}, status=400)


@extend_schema(summary="Конечная точка показа списка заказов")
class OrderList(ListAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = None
    serializer_class = OrderListSerializer

    def get_queryset(self):
        queryset = Order.objects.filter(client=self.request.user)
        query = self.request.query_params.get("sort")
        queryset = queryset.order_by(query)
        return queryset


@extend_schema(summary="Конечная точка показа деталей заказа")
class OrderDetail(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = None
    serializer_class = OrderDetailSerializer
    queryset = Order.objects.all()
    lookup_field = 'uuid'

