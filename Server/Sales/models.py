from django.db import models
from Products.models import Item
from User.models import UserAccounts
from User.models import Customer
from Products.models import Product

class OutwardSlip(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('COMPLETE', 'Complete'),
        ('INCOMPLETE', 'Incomplete'),
    )

    worker = models.ForeignKey(UserAccounts, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Slip #{self.id}"


class OutwardSlipItem(models.Model):
    outward_slip = models.ForeignKey(OutwardSlip, related_name='items', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.item.name} - {self.quantity}"


class Outward(models.Model):
    outward_slip = models.ForeignKey(OutwardSlip, related_name='outwards', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Outward #{self.id}"


class OutwardBarcode(models.Model):
    outward = models.ForeignKey(Outward, related_name='barcodes', on_delete=models.CASCADE)
    barcode = models.CharField(max_length=255)
    quantity = models.IntegerField()

    def __str__(self):
        return self.barcode

class Sale(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=50)

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)