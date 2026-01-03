from django.contrib import admin
from django.urls import path, include
from core import views  # Assurez-vous que cela est correct
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, CourseViewSet

urlpatterns = [
       path('admin/', admin.site.urls),
       path('', views.home, name='home'),  # Assurez-vous que 'home' est bien défini dans views.py
       path('register/', views.register, name='register'),  # Assurez-vous que 'register' est bien défini dans views.py
       path('api/hello/', views.HelloWorld.as_view(), name='hello_world'),
   ]

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'courses', CourseViewSet)
urlpatterns = [
       path('api/', include(router.urls)),
   ]   