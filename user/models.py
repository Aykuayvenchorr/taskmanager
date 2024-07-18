from django.db import models
from django.db.models import SET_NULL
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractUser

from structure.models import Company, Division

# Модель работника


class User(AbstractUser):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True,
    #                             related_name="related_employee", help_text="Unique ID", verbose_name="Unique ID")

    name = models.CharField(
        max_length=77, verbose_name='Имя')
    surname = models.CharField(
        max_length=77, verbose_name='Фамилия')
    company = models.ForeignKey(Company, on_delete=models.CASCADE,
                                related_name="related_employee_company", help_text="Компания", verbose_name="Компания",
                                blank=True, null=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, blank=True, null=True,
                                 related_name="related_employee_division", help_text="Подразделение", verbose_name="Подразделение")
    post = models.CharField(
        max_length=250, help_text="Должность", verbose_name="Должность",)
    patronymic = models.CharField(
        max_length=77, blank=True, null=True, help_text="Отчество", verbose_name="Отчество")
    avatar = models.ImageField(upload_to='struct/employee/avatars/',
                               blank=True, null=True, help_text="Аватар", verbose_name="Аватар")
    is_director = models.BooleanField(
        default=False, help_text="Руководитель", verbose_name="Руководитель")
    date_birth = models.DateTimeField(
        blank=True, null=True, help_text="Дата рождения", verbose_name="Дата рождения")
    contacts = models.TextField(
        blank=True, null=True, help_text="Контакты", verbose_name="Контакты")
    note = models.TextField(blank=True, null=True,
                            help_text="Примечание", verbose_name="Примечание")
    created = models.DateTimeField(
        auto_now_add=True, help_text="Создан", verbose_name='Создан')
    updated = models.DateTimeField(
        auto_now=True, help_text="Обновлен", verbose_name='Обновлен')

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ["company", "division"]
        # indexes = [models.Index(fields=['user']), ]
        # Уникальные вместе
        # unique_together = ['field1', 'field2']

    def __str__(self):
        return f'{self.surname} {self.name}'

    def get_name(self):
        return f'{self.surname} {self.name}.{self.patronymic}.'

