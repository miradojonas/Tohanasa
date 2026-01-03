# tohanasa/cv/urls.py
from django.urls import path
from .views import generate_pdf, CVListCreateView

urlpatterns = [
    path('cv/', CVListCreateView.as_view(), name='cv-list-create'),
    path('cv/pdf/<int:cv_id>/', generate_pdf, name='cv-generate-pdf'),
]
