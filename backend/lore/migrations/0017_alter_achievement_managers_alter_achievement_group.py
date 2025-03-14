# Generated by Django 5.1.6 on 2025-03-06 17:22

import django.db.models.deletion
import django.db.models.manager
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0016_rename_image_url_achievement_image'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='achievement',
            managers=[
                ('achievements', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AlterField(
            model_name='achievement',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lore.loregroup'),
        ),
    ]
