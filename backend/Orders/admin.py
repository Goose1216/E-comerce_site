from django.contrib import admin
from .models import Order, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem


class OrderAdmin(admin.ModelAdmin):
    inlines = [
        CartItemInline,
    ]


admin.site.register(CartItem)
admin.site.register(Order, OrderAdmin)
