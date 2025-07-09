from django.contrib import admin
from django.urls import path, include
from superadmin.views import get_users_with_permissions, EmailTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('superadmin.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', get_users_with_permissions),
     path("auth/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/token/email/', EmailTokenObtainPairView.as_view(), name='email_token_obtain_pair'),

]

