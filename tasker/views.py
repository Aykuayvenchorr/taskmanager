from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

# Create your views here.
from structure.views import menu_structure


# @login_required
@login_required(login_url="/")
def get_tasks(request):
    companies_dict = menu_structure()
    print(companies_dict)
    return render(request, 'base.html', {'holdings': companies_dict['holdings']})


# if not request.user.is_authenticated:
#         return redirect(f"{settings.LOGIN_URL}?next={request.path}")




