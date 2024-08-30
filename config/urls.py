"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

import comment.views
import structure.views
import tasker.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', structure.views.index),
    path('signin/', structure.views.signin, name='signin'),
    path('signout/', structure.views.signout, name='signout'),
    path('tasks/', tasker.views.tasks, name='tasks'),
    path('comments/', comment.views.get_comments, name='get_comments'),
    path('getsubcompanies/', structure.views.get_subcompanies, name='get_subcompanies'),
    path('getdivisions/', structure.views.get_divisions, name='get_divisions'),
    path('getsubdivisions/', structure.views.get_subdivisions, name='get_subdivisions'),
    path('getproject/', structure.views.get_project, name='get_project'),
    path('getlicense/', structure.views.get_license, name='get_license'),
    path('getfield/', structure.views.get_field, name='get_field'),
    path('getfacility/', structure.views.get_facility, name='get_facility'),
    path('getsubfacility/', structure.views.get_subfacility, name='get_subfacility'),
    path('addcomment/', structure.views.add_comment, name='add_comment'),
    path('addtask/', tasker.views.add_task, name='add_task'),
    path('addsubtask/', tasker.views.add_subtask, name='add_subtask'),
    path('getcomments/', structure.views.get_comments, name='get_comments'),
    path('gettasks/', tasker.views.get_tasks, name='get_tasks'),
    path('getsubtasks/', tasker.views.get_subtasks, name='get_subtasks'),
    path('checkcomment/', structure.views.check_comment, name='check_comment'),
    path('get_users/', tasker.views.get_users, name='get_users'),
    path('filter_tasks/', tasker.views.filter_tasks, name='filter_tasks'),
    path('gettask/<int:id>/', tasker.views.get_task, name='get_task'),
    path('get-tasks-by-company/', structure.views.get_tasks_by_company, name='get_tasks_by_company'),
    path('get_docs/<int:id>/', structure.views.get_docs, name='get_docs'),
    path('updatecomment/<int:id>/', structure.views.update_comment, name='update_comment'),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    # path('get_users/', tasker.views.get_users, name='get_users'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
