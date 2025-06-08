from decimal import Decimal
from django.db import models
from django.db.models import Sum, F, DecimalField
from django.core.validators import MinValueValidator
from Products.models import Product
from User.models import Customer, UserAccounts
from Purchases.models import Purchase  # Adjust import path if needed


class Sale(models.Model):
    sale_number = models.CharField(max_length=30, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="sales")
    sale_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        UserAccounts, on_delete=models.SET_NULL, null=True, blank=True, related_name="sales_recorded"
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    class Meta:
        ordering = ["-sale_date"]

    def __str__(self):
        # Assuming Customer has a related UserAccount as `user` or adjust accordingly
        customer_name = getattr(self.customer, 'name', str(self.customer)) 
        return f"Sale #{self.sale_number} – {customer_name}"

    def update_totals(self):
        total = self.barcodes.aggregate(
            total=Sum(
                F("quantity") * F("selling_price"), 
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        )["total"] or Decimal("0.00")
        self.total_amount = total
        self.save(update_fields=["total_amount"])


class Salebarcode(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="barcodes")
    purchase = models.ForeignKey(Purchase, on_delete=models.PROTECT, related_name="sale_barcodes")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)], default=1)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    class Meta:
        unique_together = ("sale", "purchase")

    def __str__(self):
        return f"{self.purchase.barcode} – {self.purchase.product.name} – Qty {self.quantity}"

    def save(self, *args, **kwargs):
        self.line_total = Decimal(self.quantity) * Decimal(self.selling_price)
        super().save(*args, **kwargs)
        self.sale.update_totals()
