   # core/models.py
from django.db import models

class Job(models.Model):
       title = models.CharField(max_length=255)
       description = models.TextField()
       location = models.CharField(max_length=255,default='Inconnu')
       job_type = models.CharField(max_length=50, default='local')  # local ou saisonnier
       created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
           return self.title

class Course(models.Model):
       title = models.CharField(max_length=255)
       description = models.TextField()
       url = models.URLField()
       created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
           return self.title
   