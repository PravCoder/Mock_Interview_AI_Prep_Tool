# Generated by Django 5.0.6 on 2024-08-31 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_question_interview_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='timestep',
            field=models.IntegerField(blank=True, default=1, null=True),
        ),
    ]
