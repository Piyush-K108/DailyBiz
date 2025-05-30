from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from User.models import *
user = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = user
        fields = "__all__"

class UserPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccounts
        fields = ('phone')



class UserAccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccounts
        fields = ['ProfilePic']
        
