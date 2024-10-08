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
    date_finish = models.DateField(blank=True, null=True)
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
        if self.date_begin:
            try:
                # Преобразуем self.term в число с плавающей запятой
                term_days = int(self.term)
                # print("Срок (в днях):", term_days, type(term_days))

                db = str(self.date_begin)

                start_date = datetime.datetime.strptime(db, "%Y-%m-%d")

                # print("Дата начала:", start_date, type(start_date))

                # Рассчитываем конечную дату
                date_end = start_date + datetime.timedelta(days=term_days)
                self.date_finish = date_end
                # print("Конечная дата:", date_end)
                return self.date_finish

            except (ValueError, TypeError) as e:
                print("Ошибка:", e)
                return None
        return None

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


class DocumentTask(models.Model):
    task = models.ForeignKey(Task, on_delete=SET_NULL, blank=True, null=True)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='tasks/', help_text="Загрузите документ")

    class Meta:
        verbose_name = "Документ"
        verbose_name_plural = "Документы"