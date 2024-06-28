# Generated by Django 4.2.13 on 2024-05-30 09:40

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, unique=True, verbose_name='Наименование')),
                ('full_name', models.CharField(help_text='Полное наименование', max_length=250, verbose_name='Полное наименование')),
                ('logo', models.ImageField(blank=True, help_text='Логотип', null=True, upload_to='struct/company/logo/', verbose_name='Логотип')),
                ('contacts', models.TextField(blank=True, help_text='Контакты', null=True, verbose_name='Контакты')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('gis', models.TextField(blank=True, help_text='GIS ID', null=True, verbose_name='GIS ID')),
                ('parent', models.ForeignKey(blank=True, help_text='Головная компания', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_subsidiaries', to='structure.company', verbose_name='Головная компания')),
            ],
            options={
                'verbose_name': 'Компания',
                'verbose_name_plural': 'Компании',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Division',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, verbose_name='Наименование')),
                ('abbr', models.CharField(help_text='Аббревиатура', max_length=250, verbose_name='Аббревиатура')),
                ('contacts', models.TextField(blank=True, help_text='Контакты', null=True, verbose_name='Контакты')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('company', models.ForeignKey(help_text='Компания', on_delete=django.db.models.deletion.CASCADE, related_name='related_divisions', to='structure.company', verbose_name='Компания')),
                ('parent', models.ForeignKey(blank=True, help_text='Руководящее', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_subsidiaries', to='structure.division', verbose_name='Руководящее')),
            ],
            options={
                'verbose_name': 'Подразделение',
                'verbose_name_plural': 'Подразделения',
                'ordering': ['company', 'name'],
            },
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, unique=True, verbose_name='Наименование')),
                ('date_start', models.DateField(help_text='Начало', verbose_name='Начало')),
                ('date_end', models.DateField(help_text='Окончание', verbose_name='Окончание')),
                ('doc', models.FileField(blank=True, help_text='Лицензия', null=True, upload_to='doc/license/', verbose_name='Лицензия')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('gis', models.TextField(blank=True, help_text='GIS ID', null=True, verbose_name='GIS ID')),
                ('owner', models.ForeignKey(help_text='Владелец', on_delete=django.db.models.deletion.CASCADE, related_name='related_license_owner', to='structure.company', verbose_name='Владелец')),
            ],
            options={
                'verbose_name': 'Лицензия',
                'verbose_name_plural': 'Лицензии',
                'ordering': ['owner', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, verbose_name='Наименование')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('gis', models.TextField(blank=True, help_text='GIS ID', null=True, verbose_name='GIS ID')),
                ('license', models.ForeignKey(help_text='Лицензия', on_delete=django.db.models.deletion.CASCADE, related_name='related_fields_license', to='structure.license', verbose_name='Лицензия')),
            ],
            options={
                'verbose_name': 'Месторождение',
                'verbose_name_plural': 'Месторождения',
                'ordering': ['license', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, verbose_name='Наименование')),
                ('count', models.FloatField(blank=True, help_text='Количество', null=True, verbose_name='Количество')),
                ('length', models.FloatField(blank=True, help_text='Протяженность', null=True, verbose_name='Протяженность')),
                ('square', models.FloatField(blank=True, help_text='Площадь', null=True, verbose_name='Площадь')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('gis', models.TextField(blank=True, help_text='GIS ID', null=True, verbose_name='GIS ID')),
                ('gist', models.TextField(blank=True, help_text='Таблица в GIS', null=True, verbose_name='Таблица в GIS')),
                ('field', models.ForeignKey(help_text='Месторождение', on_delete=django.db.models.deletion.CASCADE, related_name='related_facilities', to='structure.field', verbose_name='Месторождение')),
                ('parent', models.ForeignKey(blank=True, help_text='Основной объект', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_subsidiaries', to='structure.facility', verbose_name='Основной объект')),
            ],
            options={
                'verbose_name': 'Объект',
                'verbose_name_plural': 'Объекты',
                'ordering': ['field', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID', primary_key=True, serialize=False, verbose_name='Unique ID')),
                ('name', models.CharField(help_text='Наименование', max_length=250, verbose_name='Наименование')),
                ('contacts', models.TextField(blank=True, help_text='Контакты', null=True, verbose_name='Контакты')),
                ('note', models.TextField(blank=True, help_text='Примечание', null=True, verbose_name='Примечание')),
                ('actual', models.BooleanField(default=True, help_text='Актуально', verbose_name='Актуально')),
                ('created', models.DateTimeField(auto_now_add=True, help_text='Создан', verbose_name='Создан')),
                ('updated', models.DateTimeField(auto_now=True, help_text='Обновлен', verbose_name='Обновлен')),
                ('division', models.ForeignKey(help_text='Подразделение', on_delete=django.db.models.deletion.CASCADE, related_name='related_projects_division', to='structure.division', verbose_name='Подразделение')),
                ('licenses', models.ManyToManyField(help_text='Лицензии', related_name='related_projects_license', to='structure.license', verbose_name='Лицензии')),
            ],
            options={
                'verbose_name': 'Проект',
                'verbose_name_plural': 'Проект',
                'ordering': ['division', 'name'],
                'indexes': [models.Index(fields=['division', 'name'], name='structure_p_divisio_5587f4_idx')],
                'unique_together': {('division', 'name')},
            },
        ),
        migrations.AddIndex(
            model_name='license',
            index=models.Index(fields=['name'], name='structure_l_name_16d877_idx'),
        ),
        migrations.AddIndex(
            model_name='field',
            index=models.Index(fields=['name'], name='structure_f_name_7c170c_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together={('license', 'name')},
        ),
        migrations.AddIndex(
            model_name='facility',
            index=models.Index(fields=['name'], name='structure_f_name_778b8d_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='facility',
            unique_together={('field', 'parent', 'name')},
        ),
        migrations.AddIndex(
            model_name='division',
            index=models.Index(fields=['name'], name='structure_d_name_0d5dfa_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='division',
            unique_together={('company', 'name'), ('company', 'abbr')},
        ),
        migrations.AddIndex(
            model_name='company',
            index=models.Index(fields=['name'], name='structure_c_name_7a67c4_idx'),
        ),
    ]
