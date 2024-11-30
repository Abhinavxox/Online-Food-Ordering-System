from django.db import models
from user.models import User
from cart.models import Cart
from django.conf import settings

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE)
    delivery_charge = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=8, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        self.total = self.cart.total_price() + self.delivery_charge
        return self.total

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
