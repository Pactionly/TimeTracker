"""
Registration form
"""
from django import forms
from django.contrib.auth.forms import UserCreationForm


class RegistrationForm(UserCreationForm):
    """Email label"""
    email = forms.EmailField(
        label="Email",
        required=True
    )

    def save(self, commit=True):
        """Save metadata"""
        user = super(RegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user
