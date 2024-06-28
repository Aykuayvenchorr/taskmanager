from django import forms
from .models import Company, Division


class CompanyForm(forms.Form):
    company = forms.ModelChoiceField(
        queryset=Company.objects.all(),
        label='Выберите компанию'
    )


class DivisionForm(forms.Form):
    division = forms.ModelChoiceField(
        queryset=Division.objects.all(),
        label='Выберите подразделение'
    )