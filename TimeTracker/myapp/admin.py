"""Defines models to show in admin view"""

from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Profile)
