# G:\Projet tena izy\tohanasa\formations\views.py
from rest_framework import generics
from .models import Formation
from .serializers import FormationSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Notification, Formation
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Notification
from .serializers import NotificationSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny

class FormationListCreateView(generics.ListCreateAPIView):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer

class FormationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer

class FormationViewSet(viewsets.ModelViewSet):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
    permission_classes = [IsAuthenticated]
    
class NotifyAuthorView(APIView):
    def post(self, request):
        formation_id = request.data.get('formation_id')
        message = request.data.get('message')

        try:
            formation = Formation.objects.get(id=formation_id)
            if formation.user:
                Notification.objects.create(
                    recipient=formation.user,
                    formation=formation,
                    message=message
                )
                return Response({"detail": "Notification envoyée."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Formation sans auteur."}, status=status.HTTP_400_BAD_REQUEST)
        except Formation.DoesNotExist:
            return Response({"detail": "Formation introuvable."}, status=status.HTTP_404_NOT_FOUND)

class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
class FormationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
    permission_classes = [AllowAny]  # ⚠️ Attention : ouvert à tous