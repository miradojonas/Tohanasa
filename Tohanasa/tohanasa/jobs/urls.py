   # /tohanasa/jobs/urls.py
from django.urls import path
from .views import job_search, add_job
from .views import job_detail

urlpatterns = [
       path('search/', job_search, name='job_search'),
       path('', add_job, name='add_job'),
       path('<int:pk>/', job_detail, name='job_detail'),
   ]
   