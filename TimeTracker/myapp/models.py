from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class AuthModel(models.Model):
  id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='AuthModel')
  refresh_key = models.CharField(max_length=100)
