from django.contrib import admin
from .models import User, Job, Interview, Question
# Register your models here.
admin.site.register(User)
admin.site.register(Job)
admin.site.register(Interview)
admin.site.register(Question)