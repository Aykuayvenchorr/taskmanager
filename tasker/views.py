import json

from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from operator import itemgetter

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from structure.models import Company, Division, Project, License, Field, Facility
from structure.views import menu_structure

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


@login_required(login_url="/")
def tasks(request):
    companies_dict = menu_structure()
    return render(request, 'task.html', {'companies': companies_dict['holdings']})


def add_task(request):
    task = Task()
    data_type = request.POST.get('type', None)

    data_id = request.POST.get('id', None)

    model, field_name = model_mapping[data_type]
    related_instance = model.objects.get(id=data_id)
    structures_data = request.POST.get('structures', None)

    structures_data = json.loads(structures_data)
    if len(structures_data) > 0:
        for el in structures_data:
            mod, f_name = model_mapping[el['type']]
            rel_instance = mod.objects.get(id=el['id'])
            setattr(task, f_name, rel_instance)

    task.name = request.POST.get('name', None)

    if request.POST.get('task_id'):
        task.last_task = Task.objects.get(id=request.POST.get('task_id', None))

    task.descr_task = request.POST.get('descr_task', None)
    task.date_begin = request.POST.get('date_begin', None)
    task.term = request.POST.get('term', None)
    task.importance = request.POST.get('importance', None)
    task.date_develop = request.POST.get('date_develop', None)
    task.date_funding = request.POST.get('date_funding', None)
    task.cost = request.POST.get('cost', None)
    task.status = request.POST.get('status', None)
    task.level = request.POST.get('level', None)

    user_id = request.POST.get('select_user')
    # # Fetch the User instance
    user = get_object_or_404(User, pk=user_id)
    task.user_responsible = user
    task.user_created = request.user

    setattr(task, field_name, related_instance)
    try:
        task.save()
        m = {'message': 'Task added successfully', 'name': task.name}
        return JsonResponse(m)
    except ValidationError as e:
        return JsonResponse({'error': f'Validation error: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


def add_subtask(request):
    data_type = request.POST.get('type', None)

    data_id = request.POST.get('id', None)

    model, field_name = model_mapping[data_type]
    related_instance = model.objects.get(id=data_id)

    task = Task()

    task.name = request.POST.get('name', None)

    task.last_task = Task.objects.get(id=request.POST.get('task_id', None))

    l_tsk = Task.objects.get(id=request.POST.get('task_id', None))
    task.company = l_tsk.company or None
    task.division = l_tsk.division or None
    task.project = l_tsk.project or None
    task.license = l_tsk.license or None
    task.field = l_tsk.field or None
    task.facility = l_tsk.facility or None


    task.descr_task = request.POST.get('descr_task', None)
    task.date_begin = request.POST.get('date_begin', None)
    task.term = request.POST.get('term', None)
    task.importance = request.POST.get('importance', None)
    task.date_develop = request.POST.get('date_develop', None)
    task.date_funding = request.POST.get('date_funding', None)
    task.cost = request.POST.get('cost', None)
    task.status = request.POST.get('status', None)
    task.level = request.POST.get('level', None)

    user_id = request.POST.get('select_user')

    user = get_object_or_404(User, pk=user_id)
    task.user_responsible = user
    task.user_created = request.user

    setattr(task, field_name, related_instance)
    try:
        task.save()
        m = {'message': 'Task added successfully', 'name': task.name}
        return JsonResponse(m)
    except ValidationError as e:
        return JsonResponse({'error': f'Validation error: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


def get_tasks(request):
    kwargs = {request.POST['type']: request.POST['id']}
    tasks = Task.objects.filter(**kwargs)
    data = []
    for task in tasks:
        if task.level == 1:
            tsk = {}
            tsk['id'] = task.id
            tsk['name'] = task.name
            tsk['level'] = task.level
            tsk['descr_task'] = task.descr_task
            tsk['user_created'] = f'{task.user_created}'
            tsk['user_responsible'] = f'{task.user_responsible}'
            tsk['status'] = task.status
            tsk['importance'] = task.importance.split()[0]
            tsk['date_begin'] = task.date_begin
            tsk['term'] = f'{task.term} дн.'
            data.append(tsk)
            data = sorted(data, key=itemgetter('date_begin'), reverse=True)
    return JsonResponse(data, safe=False)


def get_task(request, id):
    task = Task.objects.get(id=id)
    users = User.objects.all()
    return JsonResponse(task, safe=False)

def get_subtasks(request):
    kwargs = {request.POST['type']: request.POST['id']}
    level = int(request.POST.get('level', 2))
    tasks = Task.objects.filter(**kwargs, level=level)
    data = []
    for task in tasks:
        if int(task.last_task.id) == int(request.POST['task_id']):
            tsk = {
                'id': task.id,
                'name': task.name,
                'level': task.level,
                'descr_task': task.descr_task,
                'user_created': f'{task.user_created}',
                'user_responsible': f'{task.user_responsible}',
                'status': task.status,
                'importance': task.importance.split()[0],
                'date_begin': task.date_begin,
                'term': f'{task.term} дн.'
            }
            data.append(tsk)
    data = sorted(data, key=itemgetter('date_begin'), reverse=True)
    return JsonResponse(data, safe=False)


def get_users(request):
    if request.method == 'GET':
        users = User.objects.all().values('id', 'name', 'surname')
        user_list = list(users)
        return JsonResponse(user_list, safe=False)


def filter_tasks(request):
    user_id = request.GET.get('responsible_user_id')
    if user_id:
        tasks = Task.objects.filter(user_responsible_id=user_id)
    else:
        tasks = Task.objects.all()

    data = []
    for task in tasks:
        task_data = {
            'id': task.id,
            'name': task.name,
            'descr_task': task.descr_task,
            'user_created': f'{task.user_created}',
            'user_responsible': f'{task.user_responsible}',
            'status': task.status,
            'importance': task.importance.split()[0],
            'date_begin': task.date_begin,
            'term': f'{task.term} дн.',
            'level': task.level,
        }
        data.append(task_data)

    return JsonResponse(data, safe=False)
