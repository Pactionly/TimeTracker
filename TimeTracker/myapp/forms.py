"""
Registration form
"""
from django import forms
from django.contrib.auth.forms import UserCreationForm


class RegistrationForm(UserCreationForm):
    """Registration Form"""
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

class TimesheetForm(forms.Form):
    """Form for submiting google sheet api requests"""
    sheet_id = forms.CharField(label='Sheet ID', max_length=100)
    activity = forms.CharField(label='Activity', max_length=100)
    comments = forms.CharField(label='Comments', max_length=200)
