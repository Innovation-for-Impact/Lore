# Generated by Django 5.1.6 on 2025-03-03 16:06

import lore.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0010_alter_loreuser_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievement',
            name='image_url',
            field=models.ImageField(null=True, upload_to=lore.models.PathAndRename('achievement_images')),
        ),
        migrations.AlterField(
            model_name='image',
            name='image_url',
            field=models.ImageField(upload_to=lore.models.PathAndRename('group_images')),
        ),
        migrations.AlterField(
            model_name='loregroup',
            name='avatar',
            field=models.ImageField(null=True, upload_to=lore.models.PathAndRename('group_avatars')),
        ),
    ]
