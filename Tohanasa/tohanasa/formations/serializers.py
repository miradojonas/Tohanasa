# formations/serializers.py
from rest_framework import serializers
from .models import Formation, Notification

class FormationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = ['id', 'title', 'institution', 'start_date', 'end_date', 'description', 'user', 'document','video_file']  # Correction ici
        read_only_fields = ['user']  # Rendre le champ user en lecture seule
  
class NotificationSerializer(serializers.ModelSerializer):
    formation_title = serializers.CharField(source='formation.title', read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read', 'formation', 'formation_title']
        read_only_fields = ['recipient', 'created_at']        
