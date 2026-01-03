# /tohanasa/jobs/serializers.py
from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company', 'location', 'description', 'jobType']  # Ajoutez jobType si nécessaire
