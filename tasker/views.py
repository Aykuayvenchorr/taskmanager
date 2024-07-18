from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from operator import itemgetter

# Create your views here.

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

# Create your views here.
from structure.models import Company, Division, Project, License, Field, Facility
from structure.views import menu_structure


# @login_required
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
    data_type = request.POST.get('type', None)
    # print(request.body)

    data_id = request.POST.get('id', None)
    # print(data_id)

    model, field_name = model_mapping[data_type]
    related_instance = model.objects.get(id=data_id)

    task = Task()
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


def get_tasks(request):
    kwargs = {request.POST['type']: request.POST['id']}
    tasks = Task.objects.filter(**kwargs)
    data = []
    for task in tasks:
        if not task.last_task:
            # us = User.objects.get(username=task.user_responsible)
            # print(us)
            # print(task.user_responsible)
            # t = f'{task.importance}'
            # imp = t.split()[0]
            # print(imp)
            tsk = {}
            tsk['id'] = task.id
            tsk['name'] = task.name
            tsk['descr_task'] = task.descr_task
            tsk['user_created'] = f'{task.user_created}'
            tsk['user_responsible'] = f'{task.user_responsible}'
            tsk['status'] = task.status
            tsk['importance'] = task.importance.split()[0]
            tsk['date_begin'] = task.date_begin
            tsk['term'] = f'{task.term} дн.'
            # print(task.user)
            # tsk['user'] = f'{task.user.surname} {task.user.name}'
            # cmt['created'] = comment.created

            # d = str(task.created).split()[0]
            # t = str(task.created).split()[1].split('.')[0]
            # tsk['created'] = f'{d} {t}'

            # tsk['actual'] = task.actual
            data.append(tsk)
            data = sorted(data, key=itemgetter('date_begin'), reverse=True)
        if task.last_task:
            tsk = {}
            tsk['id'] = task.id
            tsk['name'] = task.name
            tsk['descr_task'] = task.descr_task
            tsk['user_created'] = f'{task.user_created}'
            tsk['user_responsible'] = f'{task.user_responsible}'
            tsk['status'] = task.status
            tsk['importance'] = task.importance.split()[0]
            tsk['date_begin'] = task.date_begin
            tsk['term'] = f'{task.term} дн.'
            data.append(tsk)
            data = sorted(data, key=itemgetter('date_begin'), reverse=True)
        # print([d, t])
    return JsonResponse(data, safe=False)


def get_users(request):
    if request.method == 'GET':
        users = User.objects.all().values('id', 'name', 'surname')
        user_list = list(users)
        print(user_list)
        return JsonResponse(user_list, safe=False)