from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from User.models import *
from .models import Customer, Vendor
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
        
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'