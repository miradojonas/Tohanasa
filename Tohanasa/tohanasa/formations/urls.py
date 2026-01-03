# G:\Projet tena izy\tohanasa\formations\urls.py
from django.urls import path
from .views import FormationListCreateView, FormationDetailView
from .views import (
    FormationListCreateView, FormationDetailView, NotifyAuthorView, MyNotificationsView
)

urlpatterns = [
    path('formations/', FormationListCreateView.as_view(), name='formation-list-create'),
    path('formations/<int:pk>/', FormationDetailView.as_view(), name='formation-detail'),
    path('formations/notify/', NotifyAuthorView.as_view(), name='notify-author'),
    path('formations/my-notifications/', MyNotificationsView.as_view(), name='my-notifications'),
]
