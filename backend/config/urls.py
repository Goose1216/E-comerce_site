"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from dj_rest_auth.views import PasswordResetConfirmView
from django.urls import path, include, re_path
from allauth.account.views import confirm_email
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
                  path('admin/', admin.site.urls, name='admin'),
                  path('api/v1/', include('products.urls'), name='home'),
                  path('api-auth/', include('rest_framework.urls'), name="api_auth"),
                  path('api/v1/dj-rest-auth/', include('dj_rest_auth.urls')),
                  path('api/v1/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls'),
                       name='rest_registration'),
                  path('api/v1/dj-rest-auth/password/reset/confirm/<uidb64>/<token>/',
                       PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
                  re_path(r'^api/v1/dj-rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$', confirm_email,
                          name='account_confirm_email'),
                  path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
                  path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
