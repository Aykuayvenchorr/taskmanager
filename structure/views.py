import json
from operator import itemgetter

from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model

# Create your views here.
from comment.models import Comment, Document
from structure.forms import CompanyForm, DivisionForm
from structure.models import Company, Division, Project, License, Field, Facility
from tasker.models import Task
from user.models import User

model_mapping = {
    'company': (Company, 'company'),
    'division': (Division, 'division'),
    'project': (Project, 'project'),
    'license': (License, 'license'),
    'field': (Field, 'field'),
    'facility': (Facility, 'facility'),
}


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
    # data = request.FILES
    # print(data)
    # return JsonResponse({'message': 'Комментарий успешно добавлен.'})
    data_type = request.POST.get('type', None)
    data_id = request.POST.get('id', None)

    model, field_name = model_mapping[data_type]
    related_instance = model.objects.get(id=data_id)
    comment = Comment()
    doc = Document()

    structures_data = request.POST.get('structures', None)

    structures_data = json.loads(structures_data)
    if len(structures_data) > 0:
        for el in structures_data:
            mod, f_name = model_mapping[el['type']]
            rel_instance = mod.objects.get(id=el['id'])
            setattr(comment, f_name, rel_instance)

    comment.name = request.POST.get('name', None)
    comment.full_name = request.POST.get('full_name', None)
    comment.user = request.user
    setattr(comment, field_name, related_instance)
    # comment.save()
    try:
        comment.save()
        # Обрабатываем файлы из запроса
        files = request.FILES.getlist('file')  # Получаем список файлов
        for file in files:
            document = Document()
            document.comment = comment
            document.title = file.name
            document.file = file
            document.save()

        m = {'message': 'Comment added successfully', 'name': comment.name}
        return JsonResponse(m)
    except ValidationError as e:
        return JsonResponse({'error': f'Validation error: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


def get_comments(request):
    # model, field_name = model_mapping[request.POST['type']]
    # related_instance = model.objects.get(id=request.POST['id'])
    kwargs = {request.POST['type']: request.POST['id']}
    comments = Comment.objects.filter(**kwargs)
    data = []
    for comment in comments:
        cmt = {}
        cmt['id'] = comment.id
        cmt['name'] = comment.name
        cmt['full_name'] = comment.full_name
        cmt['user'] = f'{comment.user.surname} {comment.user.name}'
        # cmt['created'] = comment.created

        d = str(comment.created).split()[0]
        t = str(comment.created).split()[1].split('.')[0]
        cmt['created'] = f'{d} {t}'

        cmt['actual'] = comment.actual
        data.append(cmt)
        data = sorted(data, key=itemgetter('created'), reverse=True)

        # print([d, t])
    return JsonResponse(data, safe=False)


def check_comment(request):
    id = request.POST['id']
    comment = Comment.objects.get(id=id)
    comment.actual = True if request.POST['value'] == 'true' else False
    comment.save()
    data = {'check': comment.actual, }
    return JsonResponse(data, safe=False)