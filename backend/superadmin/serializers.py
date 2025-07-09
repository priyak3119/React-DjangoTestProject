from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Permission, Comment, CommentHistory

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_super_admin', 'permissions']

    def get_permissions(self, user):
        from collections import defaultdict
        perms = Permission.objects.filter(user=user)
        result = defaultdict(list)

        for perm in perms:
            result[perm.page].append(perm.action)

        return dict(result)


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'is_super_admin']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            is_super_admin=validated_data.get('is_super_admin', False),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentHistorySerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)

    class Meta:
        model = CommentHistory
        fields = '__all__'


# Custom JWT Serializer for email-based login + returning user role
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"),
                email=email,
                password=password
            )
            if not user:
                raise serializers.ValidationError("No active account found with the given credentials")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'")

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email,
            'is_super_admin': user.is_super_admin,
        }

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'user', 'page', 'action']
