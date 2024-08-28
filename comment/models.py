from django.db import models

# Create your models here.
from django.db.models import SET_NULL

from structure.models import Company, Division, Project, License, Field, Facility
from user.models import User
from django_ckeditor_5.fields import CKEditor5Field
from ckeditor.fields import RichTextField


class Comment(models.Model):
    # name = CKEditor5Field('Text', config_name='extends', blank=False, null=False,
    #                         help_text="Краткие сведения", verbose_name="Краткие сведения")
    # full_name = CKEditor5Field('Text', config_name='extends', blank=False, null=False,
    #                              help_text="Полный комментарий", verbose_name="Полный комментарий")
    name = CKEditor5Field(blank=False, null=False, help_text="Краткие сведения",
                          verbose_name="Краткие сведения", config_name='extends')
    full_name = CKEditor5Field(blank=False, null=False, help_text="Полный комментарий",
                               verbose_name="Полный комментарий", config_name='extends')

    # name = RichTextField(blank=False, null=False, help_text="Краткие сведения",
    #                       verbose_name="Краткие сведения", config_name='extends')
    # full_name = RichTextField(blank=False, null=False, help_text="Полный комментарий",
    #                            verbose_name="Полный комментарий", config_name='extends')

    created = models.DateTimeField(auto_now=True, help_text="Дата создания", verbose_name="Дата создания")
    user = models.ForeignKey(User, on_delete=SET_NULL, null=True, blank=True,
                             help_text="Пользователь", verbose_name="Пользователь")
    actual = models.BooleanField(default=True, help_text="Актуальность", verbose_name="Актуальность")

    company = models.ForeignKey(Company, on_delete=SET_NULL, blank=True, null=True,
                                help_text="Компания", verbose_name="Компания")
    division = models.ForeignKey(Division, on_delete=SET_NULL, blank=True, null=True,
                                 help_text="Подразделение", verbose_name="Подразделение")
    project = models.ForeignKey(Project, on_delete=SET_NULL, blank=True, null=True,
                                help_text="Проект", verbose_name="Проект")
    license = models.ForeignKey(License, on_delete=SET_NULL, blank=True, null=True,
                                help_text="Лицензионный участок", verbose_name="Лицензионный участок")
    field = models.ForeignKey(Field, on_delete=SET_NULL, blank=True, null=True,
                              help_text="Месторождение", verbose_name="Месторождение")
    facility = models.ForeignKey(Facility, on_delete=SET_NULL, blank=True, null=True,
                                 help_text="Объект", verbose_name="Объект")

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"


class Document(models.Model):
    comment = models.ForeignKey(Comment, on_delete=SET_NULL, blank=True, null=True)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='comments/', help_text="Загрузите документ")

    class Meta:
        verbose_name = "Документ"
        verbose_name_plural = "Документы"
