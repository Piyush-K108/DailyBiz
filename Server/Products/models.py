from django.db import models
from User.models import Vendor
from User.models import UserAccounts  # assuming you use this as Supplier

class Item(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    available_quantity = models.IntegerField(default=0)
    minimum_quantity = models.IntegerField(default=0)
    suppliers = models.ManyToManyField(UserAccounts, related_name="items")

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)
    stock = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
