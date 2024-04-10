from rest_framework import pagination
from rest_framework.response import Response
from math import ceil


class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count_products': self.page.paginator.count,
            "count_pages": ceil(self.page.paginator.count / self.page_size),
            'results': data,
        })

