from django.contrib import admin
from .models import  Product, Review, Brand, Category


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "author", "date", "rate"] 


class ReviewInline(admin.TabularInline):
    model = Review

    
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ReviewInline,
    ]
    list_filter = ["brand",]
    list_display = ["name", "price", "discount", "price_discount", "brand",]

    def price_discount(self, obj):
        return obj.get_price
    price_discount.short_description = 'Цена со скидкой'
    

    
admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Brand)
admin.site.register(Category)
