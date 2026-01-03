from django.db import models
# models.py
class Job(models.Model):
    JOB_TYPES = [
        ('Full-Time', 'Temps plein'),
        ('Part-Time', 'Temps partiel'),
        ('Internship', 'Stage'),
        ('Remote', 'Télétravail'),
        ('Contract', 'Contractuel'),
    ]

    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    jobType = models.CharField(max_length=20, choices=JOB_TYPES, default='Full-Time')

    def __str__(self):
        return self.title
