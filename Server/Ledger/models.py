from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from User.models import UserAccounts

class LedgerEntry(models.Model):
    TRANSACTION_TYPES = (
        ('debit', 'Debit'),   
        ('credit', 'Credit'), 
    )

    user = models.ForeignKey(UserAccounts, on_delete=models.CASCADE, related_name="ledger_entries")
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=6, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    description = models.TextField(blank=True, null=True)

    # Running balance after this transaction
    balance_after = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))

    class Meta:
        ordering = ['transaction_date']

    def save(self, *args, **kwargs):
        # Calculate running balance
        last_entry = LedgerEntry.objects.filter(user=self.user).order_by('-transaction_date', '-id').first()

        previous_balance = last_entry.balance_after if last_entry else Decimal('0.00')

        if self.transaction_type == 'debit':
            self.balance_after = previous_balance + self.amount
        else:  # credit
            self.balance_after = previous_balance - self.amount

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.transaction_type} - {self.amount} on {self.transaction_date.strftime('%Y-%m-%d')}"
