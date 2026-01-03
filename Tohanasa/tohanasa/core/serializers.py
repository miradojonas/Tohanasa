   # core/serializers.py
from rest_framework import serializers
from .models import Job, Course

class JobSerializer(serializers.ModelSerializer):
       class Meta:
           model = Job
           fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
       class Meta:
           model = Course
           fields = '__all__'
   