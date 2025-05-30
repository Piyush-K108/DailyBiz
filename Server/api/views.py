import os
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from User.models import UserAccounts  



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "uid"  

    def validate(self, attrs):
        phone = attrs.get("phone")
        password = attrs.get("password")

        user = UserAccounts.objects.filter(phone=phone, is_superuser=True).first()

        if not user:
            raise serializers.ValidationError("No active admin account found with the given credentials.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        # ✅ Direct string comparison (since passwords are stored as plain text)
        if user.password != password:
            raise serializers.ValidationError("Incorrect password.")

        # ✅ Use `uid` instead of `username`
        return super().validate({"uid": user.uid, "password": password})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

