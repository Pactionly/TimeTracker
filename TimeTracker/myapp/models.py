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
# pylint: disable=unused-argument
def create_user_profile(sender, instance, created, **kwargs):
    """Creates profile on user creation"""
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
# pylint: disable=unused-argument
def save_user_profile(sender, instance, **kwargs):
    """Saves profile on user save"""
    instance.profile.save()
