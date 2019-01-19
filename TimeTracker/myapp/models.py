"""Defines Database Models"""

from django.db import models
from django.contrib.auth.models import User

class AuthModel(models.Model):
    """Holds Google Auth Token"""
    id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='AuthModel'
    )
    refresh_key = models.CharField(max_length=100)

class ClockInModel(models.Model):
    """Holds Clock In Time"""
    id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='ClockInModel'
    )
    time = models.DateTimeField(default=None, blank=True, null=True)
