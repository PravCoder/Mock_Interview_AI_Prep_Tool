# Generated by Django 5.0.6 on 2024-08-18 17:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_note'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Note',
        ),
    ]
