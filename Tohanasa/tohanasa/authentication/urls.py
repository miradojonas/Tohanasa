# authentication/urls.py
from django.urls import path
from .views import UserRegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),  # Route pour l'inscription
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Route pour obtenir le token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Route pour rafraîchir le token
]
