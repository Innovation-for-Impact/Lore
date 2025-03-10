# Generated by Django 5.1.6 on 2025-03-03 03:02

import django.core.validators
import django.db.models.manager
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0005_alter_loregroup_managers_alter_loregroup_name'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='quote',
            managers=[
                ('quotes', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AlterField(
            model_name='loregroup',
            name='name',
            field=models.CharField(max_length=32, unique=True, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AlterField(
            model_name='quote',
            name='text',
            field=models.TextField(max_length=2048, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
    ]
