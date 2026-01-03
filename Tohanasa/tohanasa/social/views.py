
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Friendship, Message, Post, PostLike, Comment
from .serializers import (
    FriendshipSerializer, MessageSerializer, PostSerializer, 
    CommentSerializer, UserSerializer
)

# Vues pour les posts
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Afficher les posts de l'utilisateur et de ses amis
        user = self.request.user
        friends = User.objects.filter(
            Q(sent_friendships__receiver=user, sent_friendships__status='accepted') |
            Q(received_friendships__sender=user, received_friendships__status='accepted')
        )
        return Post.objects.filter(Q(author=user) | Q(author__in=friends))
    
    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        user = User.objects.first()  # ou User.objects.get(id=1)
        serializer.save(author=user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

# Vues pour les amis
@api_view(['GET'])
@permission_classes([AllowAny])
def friends_list(request):
    """Liste des amis acceptés"""
    friends = User.objects.filter(
        Q(sent_friendships__receiver=request.user, sent_friendships__status='accepted') |
        Q(received_friendships__sender=request.user, received_friendships__status='accepted')
    )
    serializer = UserSerializer(friends, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def friend_requests(request):
    """Demandes d'amis reçues"""
    requests = Friendship.objects.filter(
        receiver=request.user,
        status='pending'
    )
    serializer = FriendshipSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_friend_request(request, user_id):
    """Envoyer une demande d'ami"""
    try:
        receiver = User.objects.get(id=user_id)
        if receiver == request.user:
            return Response({'error': 'Vous ne pouvez pas vous envoyer une demande d\'ami'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si une demande existe déjà
        existing = Friendship.objects.filter(
            Q(sender=request.user, receiver=receiver) |
            Q(sender=receiver, receiver=request.user)
        ).first()
        
        if existing:
            return Response({'error': 'Une demande d\'ami existe déjà'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        friendship = Friendship.objects.create(
            sender=request.user,
            receiver=receiver
        )
        serializer = FriendshipSerializer(friendship)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def accept_friend_request(request, request_id):
    """Accepter une demande d'ami"""
    try:
        friendship = Friendship.objects.get(
            id=request_id,
            receiver=request.user,
            status='pending'
        )
        friendship.status = 'accepted'
        friendship.save()
        
        serializer = FriendshipSerializer(friendship)
        return Response(serializer.data)
    
    except Friendship.DoesNotExist:
        return Response({'error': 'Demande d\'ami introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def decline_friend_request(request, request_id):
    """Refuser une demande d'ami"""
    try:
        friendship = Friendship.objects.get(
            id=request_id,
            receiver=request.user,
            status='pending'
        )
        friendship.status = 'declined'
        friendship.save()
        
        serializer = FriendshipSerializer(friendship)
        return Response(serializer.data)
    
    except Friendship.DoesNotExist:
        return Response({'error': 'Demande d\'ami introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

# Vues pour les messages
@api_view(['GET'])
@permission_classes([AllowAny])
def conversations(request):
    """Liste des conversations"""
    conversations = Message.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user)
    ).values('sender', 'receiver').distinct()
    
    users = set()
    for conv in conversations:
        users.add(conv['sender'])
        users.add(conv['receiver'])
    
    users.discard(request.user.id)
    conversation_users = User.objects.filter(id__in=users)
    
    result = []
    for user in conversation_users:
        last_message = Message.objects.filter(
            Q(sender=user, receiver=request.user) |
            Q(sender=request.user, receiver=user)
        ).first()
        
        unread_count = Message.objects.filter(
            sender=user,
            receiver=request.user,
            is_read=False
        ).count()
        
        result.append({
            'user': UserSerializer(user).data,
            'last_message': MessageSerializer(last_message).data if last_message else None,
            'unread_count': unread_count
        })
    
    return Response(result)

@api_view(['GET'])
@permission_classes([AllowAny])
def messages_with_user(request, user_id):
    """Messages avec un utilisateur spécifique"""
    try:
        other_user = User.objects.get(id=user_id)
        messages = Message.objects.filter(
            Q(sender=request.user, receiver=other_user) |
            Q(sender=other_user, receiver=request.user)
        ).order_by('created_at')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request, user_id):
    """Envoyer un message"""
    try:
        receiver = User.objects.get(id=user_id)
        content = request.data.get('content')
        
        if not content:
            return Response({'error': 'Le contenu du message est requis'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            sender=request.user,
            receiver=receiver,
            content=content
        )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def mark_messages_read(request, user_id):
    """Marquer les messages comme lus"""
    Message.objects.filter(
        sender_id=user_id,
        receiver=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({'message': 'Messages marqués comme lus'})

# Vues pour les likes et commentaires
@api_view(['POST'])
@permission_classes([AllowAny])
def toggle_like(request, post_id):
    """Liker/unliker un post"""
    try:
        post = Post.objects.get(id=post_id)
        like, created = PostLike.objects.get_or_create(
            user=request.user,
            post=post
        )
        
        if not created:
            like.delete()
            return Response({'liked': False})
        
        return Response({'liked': True})
    
    except Post.DoesNotExist:
        return Response({'error': 'Post introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def post_comments(request, post_id):
    """Voir/ajouter des commentaires"""
    try:
        post = Post.objects.get(id=post_id)
        
        if request.method == 'GET':
            comments = Comment.objects.filter(post=post)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            content = request.data.get('content')
            if not content:
                return Response({'error': 'Le contenu du commentaire est requis'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            comment = Comment.objects.create(
                post=post,
                author=request.user,
                content=content
            )
            
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Post.DoesNotExist:
        return Response({'error': 'Post introuvable'}, 
                      status=status.HTTP_404_NOT_FOUND)

# Recherche d'utilisateurs
@api_view(['GET'])
@permission_classes([AllowAny])
def search_users(request):
    """Rechercher des utilisateurs"""
    query = request.GET.get('q', '')
    if len(query) < 2:
        return Response({'error': 'La requête doit contenir au moins 2 caractères'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(
        Q(username__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query)
    ).exclude(id=request.user.id)[:10]
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
