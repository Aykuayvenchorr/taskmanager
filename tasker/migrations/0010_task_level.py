# Generated by Django 4.2.13 on 2024-07-25 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasker', '0009_alter_task_cost'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='level',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
