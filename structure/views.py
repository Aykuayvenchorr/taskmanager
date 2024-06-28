from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

# Create your views here.
from structure.forms import CompanyForm, DivisionForm
from structure.models import Company, Division, Project, License, Field, Facility
from tasker.models import Task
from user.models import User


def index(request):
    form = CompanyForm()
    form1 = DivisionForm()
    tasks = Task.objects.none()  # Пустой queryset для начальной загрузки
    companies = Company.objects.all()
    return render(request, 'base.html', {'companies': companies, 'form': form, 'form1': form1, 'tasks': tasks})


def get_tasks_by_company(request):
    company_id = request.GET.get('company_id')
    tasks = Task.objects.filter(company_id=company_id)
    tasks_list = [{'id': task.id, 'name': task.name, 'descr_task': task.descr_task} for task in tasks]
    return JsonResponse(tasks_list, safe=False)


def signin(request):
    name = request.POST.get('login')
    password = request.POST.get('password')
    user = authenticate(username=name, password=password)
    if user is not None:
        login(request, user)
        data = {'login': name}
        return JsonResponse(data)
    else:
        return


def signout(request):
    logout(request)
    data = {'text': 'signout'}
    return JsonResponse(data)


def task_detail(request, pk):
    task = Task.objects.get(pk=pk)
    return render(request, 'task_detail.html', {'task': task})


def menu_structure():
    holdings = Company.objects.filter(parent__isnull=True)

    return {'holdings': holdings}


def get_subcompanies(request):
    id = request.POST.get('id', None)
    subcompanies = list(Company.objects.filter(parent=id))
    data = []
    for subcompany in subcompanies:
        data.append([subcompany.id, subcompany.name])
    return JsonResponse(data, safe=False)


def get_divisions(request):
    id = request.POST.get('id', None)
    divisions = list(Division.objects.filter(company=id))
    data = []
    for division in divisions:
        if not division.parent:
            data.append([division.id, division.abbr])
    return JsonResponse(data, safe=False)


def get_subdivisions(request):
    id = request.POST.get('id', None)
    divisions = list(Division.objects.filter(parent=id))
    data = []
    for division in divisions:
        if division.parent:
            data.append([division.id, division.abbr])
    return JsonResponse(data, safe=False)


def get_project(request):
    id = request.POST.get('id', None)
    projects = list(Project.objects.filter(division=id))
    data = []
    for project in projects:
         data.append([project.id, project.name])

    return JsonResponse(data, safe=False)


def get_license(request):
    id = request.POST.get('id', None)
    try:
        project = Project.objects.get(id=id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)

    # Получаем лицензии, связанные с проектом
    licenses = project.licenses.all()
    print(licenses)

    # Формируем данные для ответа
    data = [[license.id, license.name] for license in licenses]

    return JsonResponse(data, safe=False)


def get_field(request):
    id = request.POST.get('id', None)
    try:
        fields = Field.objects.filter(license=id)
    except Field.DoesNotExist:
        return JsonResponse({"error": "License not found"}, status=404)

    # Получаем месторождения, связанные с лицензиями
    data = []
    for field in fields:
         data.append([field.id, field.name])

    return JsonResponse(data, safe=False)


def get_facility(request):
    id = request.POST.get('id', None)
    facilities = Facility.objects.filter(field=id)
    data = []
    for facility in facilities:
        if not facility.parent:
            data.append([facility.id, facility.name])
    return JsonResponse(data, safe=False)


def get_subfacility(request):
    id = request.POST.get('id', None)
    facilities = Facility.objects.filter(parent=id)
    data = []
    for facility in facilities:
        if facility.parent:
            data.append([facility.id, facility.name])
    return JsonResponse(data, safe=False)


def add_comment(request):
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    data_type = request.POST.get('type', None)
    data_id = request.POST.get('id', None)
    print('data-type:', data_type)
    print('data-id:', data_id)
    print('user:', user_id, user)
    return render(request, 'base.html')
