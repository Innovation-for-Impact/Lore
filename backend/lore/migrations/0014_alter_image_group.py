# Generated by Django 5.1.6 on 2025-03-05 01:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0013_alter_image_managers_rename_image_url_image_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lore.loregroup'),
        ),
    ]
