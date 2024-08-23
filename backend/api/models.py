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

   # documents = 



