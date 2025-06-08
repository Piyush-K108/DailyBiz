from django.db import models
from User.models import Vendor


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    available_quantity = models.IntegerField(default=0)
    minimum_quantity = models.IntegerField(default=0)

    vendors = models.ManyToManyField(
        Vendor,
        through='ProductVendor',
        related_name='products',
        help_text="Vendors that supply this product"
    )

    def __str__(self):
        return self.name


class ProductVendor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    supply_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    preferred = models.BooleanField(default=False)

    class Meta:
        unique_together = ('product', 'vendor')

    def __str__(self):
        return f"{self.vendor.user.get_full_name()} supplies {self.product.name}"
