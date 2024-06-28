# Generated by Django 4.2.13 on 2024-06-19 11:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('structure', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(help_text='Краткие сведения', verbose_name='Краткие сведения')),
                ('full_name', models.TextField(help_text='Полный комментарий', verbose_name='Полный комментарий')),
                ('created', models.DateTimeField(auto_now=True, help_text='Дата создания', verbose_name='Дата создания')),
                ('actual', models.BooleanField(default=True, help_text='Актуальность', verbose_name='Актуальность')),
                ('company', models.ForeignKey(blank=True, help_text='Компания', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.company', verbose_name='Компания')),
                ('division', models.ForeignKey(blank=True, help_text='Подразделение', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.division', verbose_name='Подразделение')),
                ('facility', models.ForeignKey(blank=True, help_text='Объект', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.facility', verbose_name='Объект')),
                ('field', models.ForeignKey(blank=True, help_text='Месторождение', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.field', verbose_name='Месторождение')),
                ('license', models.ForeignKey(blank=True, help_text='Лицензионный участок', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.license', verbose_name='Лицензионный участок')),
                ('project', models.ForeignKey(blank=True, help_text='Проект', null=True, on_delete=django.db.models.deletion.SET_NULL, to='structure.project', verbose_name='Проект')),
                ('user', models.ForeignKey(blank=True, help_text='Пользователь', null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
        ),
    ]
