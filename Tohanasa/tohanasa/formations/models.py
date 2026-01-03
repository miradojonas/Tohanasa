# formations/models.py
from django.db import models
from django.contrib.auth.models import User

class Formation(models.Model):
    title = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField()
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)  # Ajoutez ce champ pour l'utilisateur
    document = models.FileField(upload_to='documents/', null=True, blank=True)  # Correction ici
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    type = models.CharField(max_length=20, choices=[('online', 'En ligne'), ('in-person', 'En personne')])
    
    def __str__(self):
        return self.title
    
class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification pour {self.recipient.username} - {self.message}"    
