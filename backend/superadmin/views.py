from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Permission, User
from .serializers import PermissionSerializer,UserSerializer
from django.shortcuts import get_object_or_404


class UserPermissionListCreateDelete(APIView):
    def get(self, request):
        user_id = request.query_params.get("user")
        permissions = Permission.objects.filter(user_id=user_id)
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)

    def delete(self, request):
        user_id = request.query_params.get("user")
        Permission.objects.filter(user_id=user_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        serializer = PermissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .models import Comment, Permission, CommentHistory
from .serializers import (
    UserSerializer,
    RegisterUserSerializer,
    PermissionSerializer,
    CommentSerializer,
    CommentHistorySerializer,
    EmailTokenObtainPairSerializer,
)

User = get_user_model()

# Custom JWT Email Login View
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


# API: Get all users with their permissions (for Super Admin table view)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_with_permissions(request):
    users = User.objects.all()
    data = []
    for user in users:
        permissions = Permission.objects.filter(user=user)
        perm_dict = {}
        for perm in permissions:
            if perm.page not in perm_dict:
                perm_dict[perm.page] = []
            perm_dict[perm.page].append(perm.action)

        data.append({
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'is_super_admin': user.is_super_admin,
            'permissions': perm_dict,
        })
    return Response(data)


# Register user (Only super admin)
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_super_admin:
            return Response({'detail': 'Unauthorized'}, status=403)
        return super().post(request, *args, **kwargs)


# List all users (Super admin only)
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_super_admin:
            return User.objects.all()
        # Normal user only sees their own user info
        return User.objects.filter(id=self.request.user.id)


# Permissions viewset
class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Super admin sees all permissions
        if user.is_super_admin:
            return Permission.objects.all()
        # Normal user sees only their permissions
        return Permission.objects.filter(user=user)

    def destroy(self, request, *args, **kwargs):
        # Optionally delete all permissions of a user by query param ?user=<id>
        user_id = request.query_params.get('user')
        if user_id:
            Permission.objects.filter(user_id=user_id).delete()
            return Response({'detail': 'Permissions deleted'}, status=204)
        return super().destroy(request, *args, **kwargs)


# Comments ViewSet with edit history tracking
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        page = self.request.query_params.get('page')
        if page:
            return Comment.objects.filter(page=page)
        return Comment.objects.all()

    def perform_create(self, serializer):
        comment = serializer.save(created_by=self.request.user)
        # Track history
        CommentHistory.objects.create(
            comment=comment,
            modified_by=self.request.user,
            text=comment.text
        )

    def perform_update(self, serializer):
        comment = serializer.save()
        # Track history on update
        CommentHistory.objects.create(
            comment=comment,
            modified_by=self.request.user,
            text=comment.text
        )


# Comment edit history (Super admin only)
class CommentHistoryView(generics.ListAPIView):
    serializer_class = CommentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only super admins can view history
        if not self.request.user.is_super_admin:
            return CommentHistory.objects.none()
        comment_id = self.kwargs['comment_id']
        return CommentHistory.objects.filter(comment_id=comment_id)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    user.username = request.data.get("username", user.username)
    user.save()
    return Response(UserSerializer(user).data)

class UpdateUserPermissions(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        permissions_data = request.data.get("permissions", {})

        # Delete existing permissions
        Permission.objects.filter(user=user).delete()

        # Create new permissions
        new_perms = []
        for page, actions in permissions_data.items():
            for action, value in actions.items():
                if value:
                    new_perms.append(Permission(user=user, page=page, action=action))

        Permission.objects.bulk_create(new_perms)

        return Response({"detail": "Permissions updated."}, status=status.HTTP_200_OK)
    


class PermissionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PermissionSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user")
        if user_id:
            return Permission.objects.filter(user_id=user_id)
        return Permission.objects.all()

class PermissionDeleteByUserAPIView(generics.DestroyAPIView):
    serializer_class = PermissionSerializer

    def delete(self, request, *args, **kwargs):
        user_id = request.query_params.get("user")
        if user_id:
            Permission.objects.filter(user_id=user_id).delete()
            return Response(status=204)
        return Response({"error": "user param is required"}, status=400)
    

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        user.username = request.data.get("username", user.username)
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
