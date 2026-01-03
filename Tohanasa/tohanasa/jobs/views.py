# /tohanasa/jobs/views.py
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Job
from .serializers import JobSerializer  # Assurez-vous d'avoir un serializer pour le modèle Job
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

def job_search(request):
    keyword = request.GET.get('keyword', '')
    location = request.GET.get('location', '')
    jobs = Job.objects.all()

    if keyword:
        jobs = jobs.filter(title__icontains=keyword)
    if location:
        jobs = jobs.filter(location__icontains=location)

    return render(request, 'jobs/job_search.html', {'jobs': jobs})

@api_view(['POST'])
def add_job(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        job = serializer.save()
        return JsonResponse(job.to_dict(), status=201)  # Retourner l'emploi créé
    return JsonResponse(serializer.errors, status=400)

@api_view(['GET'])
def job_detail(request, pk):
    job = get_object_or_404(Job, pk=pk)
    serializer = JobSerializer(job)
    return Response(serializer.data)
