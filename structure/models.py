from django.db import models
from uuid import uuid4
from django.contrib.auth.models import User


# Модель предприятия
class Company(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    name = models.CharField(max_length=250, unique=True,
                            help_text="Наименование", verbose_name="Наименование")
    full_name = models.CharField(
        max_length=250, help_text="Полное наименование", verbose_name="Полное наименование")
    parent = models.ForeignKey('Company', on_delete=models.CASCADE, blank=True, null=True,
                               related_name="related_subsidiaries", help_text="Головная компания", verbose_name="Головная компания")
    logo = models.ImageField(blank=True, null=True, upload_to="struct/company/logo/",
                             help_text="Логотип", verbose_name="Логотип")
    contacts = models.TextField(
        blank=True, null=True, help_text="Контакты", verbose_name="Контакты")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')
    gis = models.TextField(
        blank=True, null=True, help_text="GIS ID", verbose_name="GIS ID")

    class Meta:
        verbose_name = "Компания"
        verbose_name_plural = "Компании"
        ordering = ["name"]
        indexes = [models.Index(fields=['name']), ]
        # Уникальные вместе
        # unique_together = ['field1', 'field2']

    def __str__(self):
        return self.name


class Division(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    company = models.ForeignKey('Company', on_delete=models.CASCADE,
                                related_name="related_divisions", help_text="Компания", verbose_name="Компания")
    name = models.CharField(
        max_length=250, help_text="Наименование", verbose_name="Наименование")
    abbr = models.CharField(
        max_length=250, help_text="Аббревиатура", verbose_name="Аббревиатура")
    parent = models.ForeignKey('Division', on_delete=models.CASCADE, blank=True, null=True,
                               related_name="related_subsidiaries", help_text="Руководящее", verbose_name="Руководящее")
    contacts = models.TextField(
        blank=True, null=True, help_text="Контакты", verbose_name="Контакты")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')

    class Meta:
        verbose_name = "Подразделение"
        verbose_name_plural = "Подразделения"
        ordering = ["company", "name"]
        indexes = [models.Index(fields=['name']), ]
        unique_together = (('company', 'name'), ('company', 'abbr'))

    def __str__(self):
        return f'{self.abbr} ({self.company.name})'


class Project(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    division = models.ForeignKey('Division', on_delete=models.CASCADE,
                                 related_name="related_projects_division", help_text="Подразделение", verbose_name="Подразделение")
    name = models.CharField(
        max_length=250, help_text="Наименование", verbose_name="Наименование")
    licenses = models.ManyToManyField(
        'License', related_name="related_projects_license", help_text="Лицензии", verbose_name="Лицензии")
    contacts = models.TextField(
        blank=True, null=True, help_text="Контакты", verbose_name="Контакты")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проект"
        ordering = ["division", "name"]
        indexes = [models.Index(fields=["division", "name"]),]
        unique_together = ('division', 'name')

    def __str__(self):
        return f'{self.name} ({self.division.name} - {self.division.company.name})'


class License(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    name = models.CharField(max_length=250, unique=True,
                            help_text="Наименование", verbose_name="Наименование")
    owner = models.ForeignKey(Company, on_delete=models.CASCADE,
                              related_name="related_license_owner", help_text="Владелец", verbose_name="Владелец")
    date_start = models.DateField(help_text="Начало", verbose_name='Начало')
    date_end = models.DateField(
        help_text="Окончание", verbose_name='Окончание')
    doc = models.FileField(blank=True, null=True, upload_to="doc/license/",
                           help_text="Лицензия", verbose_name="Лицензия")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')
    gis = models.TextField(
        blank=True, null=True, help_text="GIS ID", verbose_name="GIS ID")

    class Meta:
        verbose_name = "Лицензия"
        verbose_name_plural = "Лицензии"
        ordering = ["owner", "name"]
        indexes = [models.Index(fields=['name']), ]

    def __str__(self):
        return f'{self.name}'


class Field(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    license = models.ForeignKey(License, on_delete=models.CASCADE,
                                related_name="related_fields_license", help_text="Лицензия", verbose_name="Лицензия")
    name = models.CharField(
        max_length=250, help_text="Наименование", verbose_name="Наименование")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')
    gis = models.TextField(
        blank=True, null=True, help_text="GIS ID", verbose_name="GIS ID")

    class Meta:
        verbose_name = "Месторождение"
        verbose_name_plural = "Месторождения"
        ordering = ["license", "name"]
        indexes = [models.Index(fields=['name']), ]
        unique_together = ('license', 'name')

    def __str__(self):
        return f'{self.name} ({self.license.name})'


class Facility(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True,
                          help_text="Unique ID", verbose_name="Unique ID")
    name = models.CharField(
        max_length=250, help_text="Наименование", verbose_name="Наименование")
    field = models.ForeignKey('Field', on_delete=models.CASCADE, related_name="related_facilities",
                              help_text="Месторождение", verbose_name="Месторождение")
    parent = models.ForeignKey('Facility', on_delete=models.CASCADE, blank=True, null=True,
                               related_name="related_subsidiaries", help_text="Основной объект", verbose_name="Основной объект")
    count = models.FloatField(
        blank=True, null=True, help_text="Количество", verbose_name="Количество")
    length = models.FloatField(
        blank=True, null=True, help_text="Протяженность", verbose_name="Протяженность")
    square = models.FloatField(
        blank=True, null=True, help_text="Площадь", verbose_name="Площадь")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    actual = models.BooleanField(
        default=True, help_text="Актуально", verbose_name="Актуально")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')
    gis = models.TextField(
        blank=True, null=True, help_text="GIS ID", verbose_name="GIS ID")
    gist = models.TextField(
        blank=True, null=True, help_text="Таблица в GIS", verbose_name="Таблица в GIS"
    )

    class Meta:
        verbose_name = "Объект"
        verbose_name_plural = "Объекты"
        ordering = ["field", "name"]
        indexes = [models.Index(fields=['name']), ]
        unique_together = ('field', 'parent', 'name')

    def __str__(self):
        return f'{self.name} ({self.field.name})'

# MODEL user
# id
# last_login
# username
# password
# first_name
# last_name
# email
# is_active
# is_staff
# is_superuser
# date_joined


