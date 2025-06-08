from django.db import models
from Products.models import Item
from User.models import UserAccounts  # supplier
from Products.models import Product
from User.models import Vendor


class Inward(models.Model):
    barcode = models.CharField(max_length=255, unique=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    supplier = models.ForeignKey(UserAccounts, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    available_quantity = models.IntegerField(default=0)
    inward_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.barcode
    


class Purchase(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
