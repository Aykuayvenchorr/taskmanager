import json
import os

from django.core.exceptions import ValidationError
from django.shortcuts import render, get_object_or_404
from operator import itemgetter

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from structure.models import Company, Division, Project, License, Field, Facility
from structure.views import menu_structure

from tasker.models import Task, DocumentTask
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
    task.date_end()

    user_id = request.POST.get('select_user')
    # # Fetch the User instance
    user = get_object_or_404(User, pk=user_id)
    task.user_responsible = user
    task.user_created = request.user

    setattr(task, field_name, related_instance)
    try:
        task.save()

        date_end = task.date_end()
        print(date_end)

        # Обрабатываем файлы из запроса
        files = request.FILES.getlist('file')  # Получаем список файлов
        for file in files:
            document = DocumentTask()
            document.task = task
            document.title = file.name
            document.file = file
            document.save()

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
    task.date_end()

    user_id = request.POST.get('select_user')

    user = get_object_or_404(User, pk=user_id)
    task.user_responsible = user
    task.user_created = request.user

    setattr(task, field_name, related_instance)
    try:
        task.save()

        # Обрабатываем файлы из запроса
        files = request.FILES.getlist('file')  # Получаем список файлов
        for file in files:
            document = DocumentTask()
            document.task = task
            document.title = file.name
            document.file = file
            document.save()

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
    tsk = {
        'id': task.id,
        'name': task.name,
        'level': task.level,
        'descr_task': task.descr_task,
        'user_created': f'{task.user_created}',
        'user_responsible': f'{task.user_responsible}',
        'user_responsible_id': task.user_responsible.id,
        'status': task.status,
        'importance': task.importance.split()[0],
        'date_begin': task.date_begin,
        'term': task.term,
        'date_develop': task.date_develop,
        'date_funding': task.date_funding,
        'cost': task.cost
    }
    users = User.objects.all()
    return JsonResponse(tsk, safe=False)


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


def update_task(request, id):
    if request.method == 'POST':
        try:
            # comment_id = request.POST.get('comment_id')
            task = Task.objects.get(id=id)

            # Обновление полей комментария
            task.name = request.POST.get('name', task.name)
            task.descr_task = request.POST.get('descr_task', task.descr_task)
            task.date_begin = request.POST.get('date', task.date_begin)
            task.term = request.POST.get('term', task.term)
            task.importance = request.POST.get('importance', task.importance)
            task.date_develop = request.POST.get('date_dev', task.date_develop)
            task.date_funding = request.POST.get('date_fund', task.date_funding)
            task.cost = request.POST.get('cost', task.cost)
            task.status = request.POST.get('status', task.status)
            task.date_end()
            # task.user_responsible = request.POST.get('select_user', task.user_responsible)

            # Получение ID пользователя из POST и назначение ответственного
            user_id = request.POST.get('select_user')
            print(user_id)
            if user_id:
                try:
                    user_responsible = User.objects.get(id=user_id)  # Предполагается, что используется модель User
                    task.user_responsible = user_responsible
                except User.DoesNotExist:
                    return JsonResponse({'error': 'User not found'}, status=404)

            # Удаление файлов, если они есть в запросе
            deleted_files = json.loads(request.POST.get('deleted_files', '[]'))
            for file_id in deleted_files:
                try:
                    document = DocumentTask.objects.get(id=file_id)
                    # Удаление файла из файловой системы
                    if document.file and os.path.isfile(document.file.path):
                        os.remove(document.file.path)
                    document.delete()
                except DocumentTask.DoesNotExist:
                    continue

            # Добавление новых файлов, если они есть
            files = request.FILES.getlist('file')
            for file in files:
                DocumentTask.objects.create(task=task, title=file.name, file=file)

            # Сохранение обновленного комментария
            task.save()
            print(task.date_finish)

            if task.status == 'Отложена' and task.level == 1:
                tasks = Task.objects.filter(last_task=task.id)
                print(tasks)


            return JsonResponse({'name': task.name,
                                 'descr_task': task.descr_task,
                                 'date': task.date_begin,
                                 'term': task.term,
                                 'importance': task.importance,
                                 'date_dev': task.date_develop,
                                 'date_fund': task.date_funding,
                                 'cost': task.cost,
                                 'status': task.status,
                                 'select_user': f'{task.user_responsible.name} {task.user_responsible.surname}',
                                 'level': task.level
                                 # 'select_user': task.user_responsible
                                 })

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def gettask_docs(request, id):
    try:
        task = Task.objects.get(id=id)
        files = DocumentTask.objects.filter(task=task)

        files_data = [{'name': file.title, 'url': file.file.url, 'id': file.id} for file in files]

        # print(files_data)
        return JsonResponse(files_data, safe=False)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Comment not found'}, status=404)


def get_filter_tasks(request):
    kwargs = {request.POST['type']: request.POST['id']}
    tasks = Task.objects.filter(**kwargs)
    user_id = request.POST.get('responsible_user')
    status = request.POST.get('status')

    data = []
    if user_id != '0':
        tasks = tasks.filter(user_responsible_id=user_id)
        # tasks = tasks.filter(status=status)
        # print(status, type(status))
    if status != 'Все':  # Если выбран конкретный статус, фильтруем по нему
        tasks = tasks.filter(status=status)
    if user_id == '0' and status == 'Все':
        tasks_all = tasks
        for task in tasks_all:
            if task.level == 1:
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

    for task in tasks:
        if task.level == 1:
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
        elif task.level != 1:
            for i in range(task.level - 1):
                last_task = task.last_task
                task = last_task
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
            if task_data not in data:
                data.append(task_data)

    return JsonResponse(data, safe=False)
