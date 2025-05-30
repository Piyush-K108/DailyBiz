import os
import traceback
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response

from rest_framework.decorators import api_view
from User.helper import  MessageHandler2
from User.models import UserAccounts
import random
import rest_framework
from User.serializers import *
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
import boto3


@api_view(['GET'])
def GetUserByRoleView(request, phone,role):
    try:
        profile = UserAccounts.objects.get(phone=phone,role=role)
        serializer = UserCreateSerializer(profile)
        return JsonResponse(serializer.data)
    except ObjectDoesNotExist:
        return JsonResponse({"error": "User profile not found."}, status=404)

@api_view(['POST'])
def CreateUserView(request):
    data = request.data
    phone = data.get('phone')
    role = data.get('role')

    if not phone:
        return JsonResponse({"error": "Phone number is required."}, status=400)

    try:
        # Check if the profile already exists
        profile = UserAccounts.objects.get(phone=phone)
        return JsonResponse({"phone": profile.phone, "uid": profile.uid})
    except ObjectDoesNotExist:
        pass

    # Create the user
    if role == "superadmin":
        user = UserAccounts.objects.create_superuser(phone=phone,password=data.get('password'))
    elif role == "admin":
        user = UserAccounts.objects.create_user(phone=phone,role=role,password=data.get('password'))
    else:
        user = UserAccounts.objects.create_user(phone=phone,role=role)

    # Send OTP

    user.otp = random.randint(100000, 999999)

    user.save()


    # return JsonResponse({"phone":"SOndas"})
    return JsonResponse({"phone": user.phone, "uid": user.uid})





class EditProfileView(APIView):
    def put(self, request, uid):
        profile = UserAccounts.objects.filter(uid=uid).first()
        if not profile:
            return Response({"error": "User profile not found."}, status=404)
        Password = request.data.get('Password')
        # Update the profile fields based on the provided data
        profile.name = request.data.get('name', profile.name)
        profile.email = request.data.get('email', profile.email)
        profile.Country = request.data.get('Country', profile.Country)
        profile.State = request.data.get('State', profile.State)
        profile.City = request.data.get('City', profile.City)
        profile.Date_of_Birth = request.data.get(
            'Date_of_Birth', profile.Date_of_Birth)
        if Password:
            profile.set_password(Password)
        # Save the profile
        profile.save()

        # Return a success response
        return JsonResponse({"message": "Profile updated successfully."})


class Uplode_ProfilePic(generics.UpdateAPIView):
    serializer_class = UserAccountsSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = 'phone'

    def get_queryset(self):
        return UserAccounts.objects.filter(phone=self.kwargs['phone'])

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        profile.ProfilePic = request.data.get('ProfilePic')
        profile.save()
        serializer = self.serializer_class(profile)
        return JsonResponse(serializer.data)


@api_view(['POST'])
def sendForm(request):
    data = request.data
    name = data.get('name')
    number = data.get('number')
    email = data.get('email')
    message = data.get('message')
    recipient = 'mataniarchitects@gmail.com'
    subject = 'New Message from Website Contact Form'

    try:
        MessageHandler2(
            phone=f'mataniarchitects@gmail.com', body=f"""
                Dear Matani Architects Team,

                You have received a new message from your website {recipient} contact form:

                - **Name**: {name}
                - **Phone Number**: {number}
                - **Email**: {email}

                **Message**:
                {message}

                Best regards,
                [Website Team]
            """,
            subject=subject).send_email()
    except Exception as e:
        print("Error:", str(e))
        print("Traceback:", traceback.format_exc())
        print("Didn't send")

    return Response(f"Done send mail from {email}")
    


@api_view(['PUT'])
def createFMC(request, phone):
    try:
        code = request.data.get('code')
        user = UserAccounts.objects.get(phone=phone)
        if user.FMC_tokens:
            tokens = [token.strip() for token in user.FMC_tokens.split(",")]
            if code in tokens:
                print(code)
                print(phone)
                return Response("Token already exists successfully", status=status.HTTP_200_OK)
            else:
                tokens.append(code)
                user.FMC_tokens = ", ".join(tokens)
        else:
            user.FMC_tokens = code
        print(code)
        print(phone)
        user.save()
        return Response("Token added successfully", status=status.HTTP_200_OK)
    except UserAccounts.DoesNotExist:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)









