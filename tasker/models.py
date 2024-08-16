from django.db import models
from django.db.models import SET_NULL
import datetime

from structure.models import Company, Division, Project, License, Field, Facility
from user.models import User


class Task(models.Model):
    IMPORTANT_CHOICES = (
        ('Низкая степень важности', 'Низкая степень важности'),
        ('Средняя степень важности', 'Средняя степень важности'),
        ('Высокая степень важности', 'Высокая степень важности'),
    )

    STATUS = (
        ('Отложена', 'Отложена'),
        ('В работе', 'В работе'),
        ('Завершена', 'Завершена'),
    )

    name = models.TextField(blank=False, null=False)
    descr_task = models.TextField(blank=False, null=False)
    date_begin = models.DateField()
    term = models.IntegerField(default=0)  # Продолжительность в днях !!!
    source = models.TextField(blank=True, null=True)
    descr_source = models.TextField(blank=True, null=True)
    last_task = models.ForeignKey('Task', on_delete=SET_NULL, blank=True, null=True)

    importance = models.CharField(max_length=50, choices=IMPORTANT_CHOICES)
    date_develop = models.DateField(blank=True, null=True)  # Дата освоения
    date_funding = models.DateField(blank=True, null=True)  # Дата финансирования
    cost = models.FloatField(default=0, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS)
    user_created = models.ForeignKey(User, on_delete=SET_NULL, null=True, blank=True, related_name='tasks_created')
    user_responsible = models.ForeignKey(User, on_delete=SET_NULL, null=True, blank=True, related_name='tasks_responsible')

    company = models.ForeignKey(Company, on_delete=SET_NULL, blank=True, null=True)
    division = models.ForeignKey(Division, on_delete=SET_NULL, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=SET_NULL, blank=True, null=True)
    license = models.ForeignKey(License, on_delete=SET_NULL, blank=True, null=True)
    field = models.ForeignKey(Field, on_delete=SET_NULL, blank=True, null=True)
    facility = models.ForeignKey(Facility, on_delete=SET_NULL, blank=True, null=True)

    level = models.IntegerField()

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

    # def save(self, *args, **kwargs):
    #     # Проверяем и устанавливаем company на основе связанных объектов, если это необходимо
    #     if not self.company:
    #         if self.division and self.division.company:
    #             self.company = self.division.company
    #         elif self.project and self.project.division and self.project.division.company:
    #             self.company = self.project.division.company
    #             self.division = self.project.division
    #         elif self.license:
    #             self.company = self.license.owner
    #         elif self.field and self.field.license:
    #             self.company = self.field.license.owner
    #             self.license = self.field.license
    #         elif self.facility and self.facility.field:
    #             self.company = self.facility.field.license.owner
    #             self.license = self.facility.field.license
    #             self.field = self.facility.field
    #
    #     # Вызов родительского метода save для сохранения изменений
    #     super(Task, self).save(*args, **kwargs)


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
