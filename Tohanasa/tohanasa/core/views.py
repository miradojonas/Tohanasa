from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Job, Course
from .serializers import JobSerializer, CourseSerializer
from django.http import JsonResponse

   # Exemple de vue pour la page d'accueil
def home(request):
       return render(request, 'core/home.html')

   # Exemple de vue pour l'enregistrement
def register(request):
       return render(request, 'core/register.html')

class HelloWorld(APIView):
       def get(self, request):
           return Response({"message": "Hello, World!"})
    
class JobViewSet(viewsets.ModelViewSet):
       queryset = Job.objects.all()
       serializer_class = JobSerializer
class CourseViewSet(viewsets.ModelViewSet):
       queryset = Course.objects.all()
       serializer_class = CourseSerializer   
       
def hello_view(request):
       return JsonResponse({'message': 'Hello, world!'})       