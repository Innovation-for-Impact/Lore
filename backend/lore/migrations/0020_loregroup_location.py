# Generated by Django 5.1.7 on 2025-04-03 23:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lore', '0019_quote_pinned'),
    ]

    operations = [
        migrations.AddField(
            model_name='loregroup',
            name='location',
            field=models.CharField(default='e', max_length=32),
            preserve_default=False,
        ),
    ]
