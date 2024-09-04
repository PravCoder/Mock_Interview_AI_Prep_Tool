from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.contrib.auth.models import AbstractUser
from datetime import datetime



class User(AbstractUser):
    first_name = models.CharField(max_length=200, null=True)
    last_name = models.CharField(max_length=200, null=True)
    email = models.EmailField(unique=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # No username required

    jobs = models.ManyToManyField("Job", related_name="jobs", blank=True)
    

class Job(models.Model):
    title = models.CharField(max_length=50, null=True)  # name of job SWE, ML intern, Senior Engineer. 
    interviews = models.ManyToManyField("Interview", related_name="interviews", blank=True)
    # add new fields to serializer 
    
class Interview(models.Model):
   job_title = models.CharField(max_length=50, null=True) 
   job_description = models.CharField(max_length=10000, null=True) 
   
   company_name= models.CharField(max_length=50, null=True) 
   company_description = models.CharField(max_length=10000, null=True) 

   resume_text = models.CharField(max_length=10000, null=True) 

   status = models.CharField(max_length=20, null=True, default="incomplete")  # complete, incomplete, in progress

   # documents = 

   questions = models.ManyToManyField("Question", related_name="questions", blank=True)

class Question(models.Model):
    prompt = models.CharField(max_length=100, null=True) 
    user_answer = models.CharField(max_length=10000, null=True) 
    feedback = models.CharField(max_length=10000, null=True) 
    timestep = models.IntegerField(default=1,  null=True,blank=True) # the order in which the questions have to be asked
 
