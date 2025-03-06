from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext, gettext_lazy as _

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_staff', 'phone_number', ]
    fieldsets = UserAdmin.fieldsets + ((_("Custom"), {"fields": ("phone_number",)}),)

admin.site.register(CustomUser, CustomUserAdmin)

