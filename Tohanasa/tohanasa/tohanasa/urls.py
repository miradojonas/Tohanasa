from django.contrib import admin
from django.urls import path, include
from core import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('', include('core.urls')),
    path('api/', include('cv.urls')),
    path('', include('chatbot.urls')),
    path('api/', include('formations.urls')),
    path('api/auth/', include('authentication.urls')),
    path('jobs/', include('jobs.urls')),
    path('api/formations/', include('formations.urls')),
    path('api/social/', include('social.urls')),
    path('', include('chatbot.urls')),  
]

# Ajoute la gestion des fichiers médias (images, etc.) en développement
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)