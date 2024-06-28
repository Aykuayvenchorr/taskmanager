from django.contrib import admin

from structure.models import Company, Division, Project, License, Field, Facility

# Register your models here.
admin.site.register(Company)
admin.site.register(Division)
admin.site.register(Project)
admin.site.register(License)
admin.site.register(Field)
admin.site.register(Facility)