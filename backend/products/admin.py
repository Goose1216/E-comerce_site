from django.contrib import admin
from .models import  Product, Review, Brand, Category


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "author", "date", "rate"] 

class ReviewInline(admin.TabularInline):
    model = Review

class CategoryInline(admin.TabularInline):
    model = Product.category.through

    
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ReviewInline,
        CategoryInline,
    ]
    exlucde = ("products",)
    list_filter = ["brand", "price",]
    list_display = ["name", "price", "brand",]
    

    
admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Brand)
admin.site.register(Category)
