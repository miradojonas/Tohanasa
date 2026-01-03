from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

# Signaux pour la gestion des notifications (optionnel)
# Vous pouvez ajouter des signaux ici plus tard pour envoyer des notifications
# quand un utilisateur reçoit une demande d'amitié ou un message
