# tohanasa/cv/models.py
from django.db import models
from django.contrib.auth.models import User

class CV(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Permet d'être nul
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    experience = models.TextField()
    education = models.TextField()
    skills = models.TextField()

    def __str__(self):
        return self.name
