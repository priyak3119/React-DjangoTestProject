from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if not user:
                raise serializers.ValidationError("No active account found with the given credentials")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'")

        refresh = self.get_token(user)

        # Custom claims
        refresh['email'] = user.email
        refresh['is_super_admin'] = user.is_super_admin

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email,
            'is_super_admin': user.is_super_admin,
        }
