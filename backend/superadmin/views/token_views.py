from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from superadmin.serializers.token_serializers import EmailTokenObtainPairSerializer
from rest_framework import serializers


User = get_user_model()

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)  # Ensure email field is required

    def validate(self, attrs):
        # Extract email and password from incoming data
        email = attrs.get('email')
        password = attrs.get('password')

        if email is None or password is None:
            raise serializers.ValidationError('Email and password are required.')

        # Try to find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No active account found with the given credentials')

        # Check password and user active status
        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect credentials')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        # Add username to attrs because parent serializer expects it
        attrs['username'] = user.get_username()

        # Call super to get the tokens (access, refresh)
        data = super().validate(attrs)

        # Optionally add extra user info in the response
        data['user'] = {
            'id': user.id,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
        }
        return data
