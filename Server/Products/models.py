from django.db import models
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
