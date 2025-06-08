from django.db import models
from Products.models import Item
from User.models import UserAccounts
from Products.models import Product
from User.models import Vendor


class Purchase(models.Model):
    barcode = models.CharField(max_length=255, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    available_quantity = models.IntegerField(default=0)
    purchase_date = models.DateTimeField(auto_now_add=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.barcode}"
