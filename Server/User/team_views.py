from django.http import JsonResponse
from requests import Response
from rest_framework.decorators import api_view
from User.models import UserAccounts
import random , string
from User.serializers import *
from django.contrib.auth import  login
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password, make_password

def authenticate(request, name, phone, password):
        try:
            user = UserAccounts.objects.get(name=name, phone=phone,password=password)
            return user
        except UserAccounts.DoesNotExist:
            pass
        return None



@api_view(['POST'])
def LoginTeamView(request):
    phone = request.data.get('phone')
    name = request.data.get('name')
    swaf_staff = request.data.get('swaf_staff')

    if not phone:
        return Response({'error': 'Phone is required.'}, status=400)

    user = UserAccounts.objects.filter(phone=phone).first()

    if user:
        user.name = name
        user.is_staff = True
        if swaf_staff:
            user.is_swap_staff = True
        user.save()
        return JsonResponse({'message': 'User updated successfully.'})
    
    # Generate a random password for new users
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=5))

    if swaf_staff:
        UserAccounts.objects.create_swapteamuser(name=name, phone=phone, password=password, is_swap_staff=True)
    else:
        UserAccounts.objects.create_teamuser(name=name, phone=phone, password=password)

    return JsonResponse({'message': 'Team account created successfully.', 'password': password})



@api_view(['POST'])
def VerifyTeamView(request):
    phone = request.data.get('phone')
    name = request.data.get('name')
    password = request.data.get('password')

    name_parts = name.rsplit(' ', 1)
    if len(name_parts) > 1:
        first_name, last_name = name_parts
        formatted_name = f"{first_name} {last_name}"
    else:
        first_name = name
        last_name = None  
        formatted_name = first_name

    print(formatted_name)
    
    if not phone  or not password:
        return JsonResponse({'error': 'Phone, name, and password are required.'}, status=400)
    
    
    try:
        user2 = UserAccounts.objects.get(phone=phone, is_staff=1)
    except UserAccounts.DoesNotExist:
        return JsonResponse({"error": "User is not a staff."}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'An error occurred: ' + str(e)}, status=500)

    hashed_password_from_database = user2.password
    
    if  check_password(password, hashed_password_from_database):
        # If the password matches, use it directly for authentication
        hashed_password = password
        authenticated_user = user2

    else:
        # If the password does not match, hash the provided password
        hashed_password = password
        authenticated_user = authenticate(request, name=formatted_name, phone=phone, password=hashed_password)


    if authenticated_user is not None:
        # Login the user
        try:
           login(request, authenticated_user)
        except:
            print("Try again")
        user_account = UserAccounts.objects.filter(phone=phone).first()
        if user_account is not None:
            return JsonResponse({'message': 'Team login successful.', 'uid': user_account.uid})
        else:
            return JsonResponse({'error': 'User account not found.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid phone or password.'}, status=401)




@api_view(['PUT'])
def UpdateTeamView(request):
    phone = request.data.get('phone')
    password = request.data.get('password')
    user = UserAccounts.objects.get(phone=phone,is_staff=1)
    name = request.data.get('name')
    name_parts = name.rsplit(' ', 1)
    if len(name_parts) > 1:
        first_name, last_name = name_parts
        formatted_name = f"{first_name} {last_name}"
    else:
        first_name = name
        last_name = None  
        formatted_name = first_name
    user.name = formatted_name
    if user.is_superuser:
        user.set_password(password)
    else:
        user.password = password
 
    user.save()
    return JsonResponse({'message': 'User updated successfully.'})