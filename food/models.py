from django.db import models
from vendor.models import Vendor

class FoodItem(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="food_items")
    name = models.CharField(max_length=255)
    description = models.TextField()  
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.vendor.name}"

