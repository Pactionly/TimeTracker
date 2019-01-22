"""Defines Database Models"""

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    """Stores additional user specific information"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    refresh_key = models.CharField(max_length=100)
    clock_in_time = models.DateTimeField(default=None, blank=True, null=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

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
