# authentication/views.py
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]  # Permet à tout le monde de s'inscrire

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        username = (str(username).strip() if username is not None else '')
        email = (str(email).strip() if email is not None else '')

        if not username:
            return Response({"error": "Nom d'utilisateur requis."}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({"error": "Mot de passe requis."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Ce nom d'utilisateur est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

        if email and User.objects.filter(email=email).exists():
            return Response({"error": "Cette adresse email est déjà utilisée."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = User(username=username, email=email)
                user.set_password(password)
                user.save()
        except IntegrityError:
            # Sécurité: évite un 500 si une contrainte DB saute (race condition, etc.)
            return Response({"error": "Impossible de créer le compte. Vérifiez les informations et réessayez."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Utilisateur créé avec succès."}, status=status.HTTP_201_CREATED)
