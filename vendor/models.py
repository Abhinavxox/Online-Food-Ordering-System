from django.db import models
from django.conf import settings

class Vendor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile',
        null=True,  
        blank=True  
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=15)
    image = models.ImageField(upload_to='vendors/', null=True, blank=True)

    def __str__(self):
        return self.name