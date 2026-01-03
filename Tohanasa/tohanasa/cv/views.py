from rest_framework import generics
from .models import CV
from .serializers import CVSerializer
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
import os
import pdfkit

class CVListCreateView(generics.ListCreateAPIView):
    queryset = CV.objects.all()
    serializer_class = CVSerializer

    def perform_create(self, serializer):
        serializer.save(user=None)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return HttpResponse(serializer.data, status=201)
        return HttpResponse(serializer.errors, status=400)

def generate_pdf(request, cv_id):
    try:
        cv = CV.objects.get(id=cv_id)
    except CV.DoesNotExist:
        return HttpResponse(status=404)

    # Chemin absolu vers le CSS
    css_path = os.path.join(settings.BASE_DIR, 'cv', 'static', 'cv', 'cv_style.css')

    # Rendu du template avec le chemin local vers le CSS
    html_string = render_to_string('cv_template.html', {
        'cv': cv,
        'css_path': f'file://{css_path}'
    })

    # Options wkhtmltopdf
    options = {
        'encoding': 'UTF-8',
        'enable-local-file-access': ''  # nécessaire pour les fichiers locaux
    }

    # Génération du PDF
    pdf = pdfkit.from_string(html_string, False, options=options)

    # Réponse HTTP avec le PDF
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{cv.name}_CV.pdf"'
    return response
