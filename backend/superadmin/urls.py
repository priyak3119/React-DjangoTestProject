from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterUserView,
    UserListView,
    PermissionViewSet,
    CommentViewSet,
    CommentHistoryView,
    EmailTokenObtainPairView,
    profile_view,  
    UpdateUserPermissions,
    UserPermissionListCreateDelete,
    PermissionListCreateAPIView,
    PermissionDeleteByUserAPIView,
)

router = DefaultRouter()
router.register(r'permissions', PermissionViewSet, basename='permissions')
router.register(r'comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('auth/register/', RegisterUserView.as_view(), name='register'),
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='custom_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/', UserListView.as_view(), name='user_list'),
    path('profile/', profile_view, name='profile'),

    path('comments/<int:comment_id>/history/', CommentHistoryView.as_view(), name='comment_history'),
    path('users/<int:pk>/permissions/', UpdateUserPermissions.as_view(), name='update_user_permissions'),

    path('', include(router.urls)),
    path("permissions/user/", UserPermissionListCreateDelete.as_view(), name="user-permissions"),
    path("permissions/list-create/", PermissionListCreateAPIView.as_view(), name="permissions-list-create"),
    path("permissions/delete/", PermissionDeleteByUserAPIView.as_view(), name="permissions-delete-by-user"),
]
