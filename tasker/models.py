from django.db import models
from django.db.models import SET_NULL
import datetime

from structure.models import Company, Division, Project, License, Field, Facility
from user.models import User


class Task(models.Model):
    IMPORTANT_CHOICES = (
        ('1', 'Низкая степень важности'),
        ('2', 'Средняя степень важности'),
        ('3', 'Высокая степень важности'),
    )

    STATUS = (
        ('1', 'Отложена'),
        ('2', 'В работе'),
        ('3', 'Завершена'),
    )

    name = models.TextField(blank=False, null=False)
    descr_task = models.TextField(blank=False, null=False)
    date_begin = models.DateTimeField(default=datetime.datetime(2000, 1, 1, 0, 0))
    term = models.IntegerField(default=0)  # Продолжительность в днях !!!
    source = models.TextField(blank=True, null=True)
    descr_source = models.TextField(blank=True, null=True)
    last_task = models.ForeignKey('Task', on_delete=SET_NULL, blank=True, null=True)

    importance = models.CharField(max_length=50, choices=IMPORTANT_CHOICES)
    date_develop = models.DateTimeField()
    date_funding = models.DateTimeField()
    cost = models.FloatField(default=0)
    status = models.CharField(max_length=50, choices=STATUS)
    user = models.ForeignKey(User, on_delete=SET_NULL, null=True, blank=True)

    company = models.ForeignKey(Company, on_delete=SET_NULL, blank=True, null=True)
    division = models.ForeignKey(Division, on_delete=SET_NULL, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=SET_NULL, blank=True, null=True)
    license = models.ForeignKey(License, on_delete=SET_NULL, blank=True, null=True)
    field = models.ForeignKey(Field, on_delete=SET_NULL, blank=True, null=True)
    facility = models.ForeignKey(Facility, on_delete=SET_NULL, blank=True, null=True)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        # ordering = ["company", "division"]
        # indexes = [models.Index(fields=['user']), ]
        # Уникальные вместе
        # unique_together = ['field1', 'field2']

    def __str__(self):
        return f'{self.name}'

    def date_end(self):
        return self.date_begin + datetime.timedelta(days=self.term)

    def date_begin_from_last_task(self):
        pass


class TaskDependencies(models.Model):
    dependent = models.ForeignKey(
        Task, on_delete=SET_NULL, null=True, blank=True, verbose_name='Зависимая задача', related_name='dependent')
    defining = models.ForeignKey(
        Task, on_delete=SET_NULL, null=True, blank=True, verbose_name='Определяющая задача', related_name='defining')
    step = models.IntegerField(
        default=0)

    class Meta:
        verbose_name = "Зависимость задачи"
        verbose_name_plural = "Зависимости задач"
        # ordering = ["company", "division"]
        # indexes = [models.Index(fields=['user']), ]
        # Уникальные вместе
        # unique_together = ['field1', 'field2']

    def __str__(self):
        return f'{self.dependent.name} от {self.defining.name}'
