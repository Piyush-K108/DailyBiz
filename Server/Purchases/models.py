from django.db import models
from Products.models import Item
from User.models import UserAccounts  # supplier

class Inward(models.Model):
    barcode = models.CharField(max_length=255, unique=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    supplier = models.ForeignKey(UserAccounts, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    available_quantity = models.IntegerField(default=0)
    inward_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.barcode
