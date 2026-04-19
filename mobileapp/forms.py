from django.contrib.auth.models import User
from mobileapp.models import userDetails
from django import forms

class userForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = User
        fields = ['username','email','password']

class userProfile(forms.ModelForm):
    class Meta:
        model = userDetails
        fields = ['age','userpic']