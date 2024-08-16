from django.contrib import admin

# Register your models here.
from comment.models import Comment, Document

admin.site.register(Comment)
admin.site.register(Document)
