from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
