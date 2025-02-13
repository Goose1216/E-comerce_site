from dj_rest_auth.views import PasswordResetConfirmView
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from users.views import GoogleLoginView, YandexLoginView


urlpatterns = [
                  path('v1/products/', include('products.urls'), name='products'),
                  path('v1/carts/', include('carts.urls'), name='carts'),
                  path('v1/orders/', include('orders.urls'), name='orders'),
                  path('api-auth/', include('rest_framework.urls'), name="api_auth"),
                  path('v1/dj-rest-auth/', include('dj_rest_auth.urls')),
                  path('v1/dj-allauth/', include('allauth.urls'), name='socialaccount_signup'),
                  path('v1/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls'),
                       name='rest_registration'),
                  path('v1/dj-rest-auth/password/reset/confirm/<uidb64>/<token>/',
                       PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
                  #re_path(r'^v1/dj-rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$', confirm_email,
                  #       name='account_confirm_email'),
                  path("v1/dj-rest-auth/google/login/", GoogleLoginView.as_view(), name="google_login"),
                  path("v1/dj-rest-auth/yandex/login/", YandexLoginView.as_view(), name="yandex_login"),
                  path('schema/', SpectacularAPIView.as_view(), name='schema'),
                  path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
              ]
