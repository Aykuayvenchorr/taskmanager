from django.shortcuts import render

from structure.views import menu_structure

# Create your views here.
def get_comments(request):
    msdict = menu_structure()
    return render(request, 'comment.html', {'companies': msdict['holdings']})
    # return render(request, 'task_detail.html', {'task': task})