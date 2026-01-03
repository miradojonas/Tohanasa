
from django.urls import path
from . import views

urlpatterns = [
    # Posts
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', views.toggle_like, name='toggle-like'),
    path('posts/<int:post_id>/comments/', views.post_comments, name='post-comments'),
    
    # Amis
    path('friends/', views.friends_list, name='friends-list'),
    path('friend-requests/', views.friend_requests, name='friend-requests'),
    path('friend-requests/send/<int:user_id>/', views.send_friend_request, name='send-friend-request'),
    path('friend-requests/<int:request_id>/accept/', views.accept_friend_request, name='accept-friend-request'),
    path('friend-requests/<int:request_id>/decline/', views.decline_friend_request, name='decline-friend-request'),
    
    # Messages
    path('conversations/', views.conversations, name='conversations'),
    path('messages/<int:user_id>/', views.messages_with_user, name='messages-with-user'),
    path('messages/send/<int:user_id>/', views.send_message, name='send-message'),
    path('messages/mark-read/<int:user_id>/', views.mark_messages_read, name='mark-messages-read'),
    
    # Recherche
    path('search/users/', views.search_users, name='search-users'),
]
