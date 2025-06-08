from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from decimal import Decimal


class UserAccountManager(BaseUserManager):
    def create_user(self, phone,role, password=None):
        if not phone:
            raise ValueError("User must have a phone number")
        user = self.model(phone=phone)
        user.set_password(password)
        user.role = role
        user.is_active = True
        user.save()
        return user

    def create_superuser(self, phone, password):
        user = self.create_user(phone=phone,role="superadmin", password=password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.role = 'superadmin'
        user.save()
        return user


class LastUsedID(models.Model):
    last_uid = models.PositiveIntegerField(default=1000)

    def increment_uid(self):
        self.last_uid += 1
        self.save()
        return self.last_uid


class UserAccounts(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
        ('admin', 'Admin'),
        ('superadmin', 'Super Admin'),
    )

    def FileName(instance, filename):
        return '/'.join(['images', str(instance.uid) + str(instance.name), filename])

    uid = models.CharField(max_length=255, primary_key=True, default='')
    name = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=20, unique=True, null=False)
    email = models.CharField(max_length=255, unique=True, null=True)
    Country = models.CharField(max_length=255, null=True)
    State = models.CharField(max_length=255, null=True)
    City = models.CharField(max_length=255, null=True)
    Gender = models.CharField(max_length=255, null=True)
    Date_of_Birth = models.DateField(null=True)
    otp = models.CharField(max_length=6, null=True)
    ProfilePic = models.ImageField(upload_to=FileName, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='customer')

    amount_to_take = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal('0.00'),
        help_text="Amount user owes to you"
    )
    amount_to_give = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal('0.00'),
        help_text="Amount you owe to the user"
    )

    FMC_tokens = models.TextField(default="", blank=True)

    USERNAME_FIELD = 'phone'

    objects = UserAccountManager()

    def save(self, *args, **kwargs):
        if not self.uid:
            with transaction.atomic():
                last_used_id, created = LastUsedID.objects.get_or_create(pk=1)
                while True:
                    new_uid = f"U_AC{last_used_id.increment_uid()}"
                    if not UserAccounts.objects.filter(uid=new_uid).exists():
                        self.uid = new_uid
                        break
        super().save(*args, **kwargs)

    def get_full_name(self):
        return self.name or self.phone

    def get_short_name(self):
        return self.name or self.phone

    def __str__(self):
        return f"{self.uid} - {self.phone}"
    

class Customer(models.Model):

    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class Vendor(models.Model):

    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
