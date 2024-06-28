from django.contrib import admin

from tasker.models import TaskDependencies, Task

admin.site.register(Task)
admin.site.register(TaskDependencies)
