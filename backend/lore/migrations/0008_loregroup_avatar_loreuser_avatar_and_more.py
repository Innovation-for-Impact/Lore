# Generated by Django 5.1.6 on 2025-03-03 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0007_alter_quote_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='loregroup',
            name='avatar',
            field=models.ImageField(null=True, upload_to='group_avatar'),
        ),
        migrations.AddField(
            model_name='loreuser',
            name='avatar',
            field=models.ImageField(null=True, upload_to='avatars'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image_url',
            field=models.ImageField(upload_to='group_images'),
        ),
    ]
