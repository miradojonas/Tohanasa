import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, UserPlus, CheckCircle, XCircle, Users, PlusCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // adapte si besoin
});

export default function App() {
  // Posts
  const [posts, setPosts] = useState([]);
  const [showCommentsPostId, setShowCommentsPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Nouveau post (texte uniquement)
  const [newPostContent, setNewPostContent] = useState('');

  // Amis
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [newFriendId, setNewFriendId] = useState('');

  // Conversations
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchFriendRequests();
    fetchFriends();
    fetchConversations();
  }, []);

  // Chargement posts
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/');
      setPosts(res.data);
    } catch (err) {
      alert('Erreur chargement posts');
    }
  };

  // Like/unlike
  const toggleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like/`);
      fetchPosts();
    } catch {
      alert('Erreur like post');
    }
  };

  // Ouvrir commentaires
  const openComments = async (postId) => {
    try {
      const res = await api.get(`/posts/${postId}/comments/`);
      setComments(res.data);
      setShowCommentsPostId(postId);
      setNewComment('');
    } catch {
      alert('Erreur chargement commentaires');
    }
  };

  // Ajouter un commentaire
  const addComment = async () => {
    if (!newComment.trim()) return alert('Commentaire vide');
    try {
      await api.post(`/posts/${showCommentsPostId}/comments/`, { content: newComment });
      openComments(showCommentsPostId);
    } catch {
      alert('Erreur ajout commentaire');
    }
  };

  // **Publier un nouveau post (texte uniquement)**
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return alert('Le contenu du post est requis');
    try {
      await api.post('/posts/', { content: newPostContent });
      setNewPostContent('');
      fetchPosts();
      alert('Post publié !');
    } catch (err) {
      alert('Erreur publication post : ' + (err.response?.data || err.message));
    }
  };

  // Amis
  const fetchFriendRequests = async () => {
    try {
      const res = await api.get('/friend-requests/');
      setFriendRequests(res.data);
    } catch {
      alert('Erreur chargement demandes amis');
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await api.get('/friends/');
      setFriends(res.data);
    } catch {
      alert('Erreur chargement amis');
    }
  };

  const respondFriendRequest = async (id, accept) => {
    try {
      await api.post(`/friend-requests/${id}/${accept ? 'accept' : 'decline'}/`);
      fetchFriendRequests();
      fetchFriends();
    } catch {
      alert('Erreur réponse demande ami');
    }
  };

  const sendFriendRequest = async () => {
    if (!newFriendId) return alert('ID utilisateur requis');
    try {
      await api.post(`/friend-requests/send/${newFriendId}/`);
      alert('Demande envoyée');
      setNewFriendId('');
      fetchFriendRequests();
    } catch (e) {
      alert('Erreur envoi demande: ' + (e.response?.data?.error || e.message));
    }
  };

  // Conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations/');
      setConversations(res.data);
    } catch {
      alert('Erreur chargement conversations');
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">🌐 Tohan'asa Partage</h2>

      {/* FORMULAIRE NOUVEAU POST */}
      <section className="mb-5">
        <h4><PlusCircle size={20} /> Publier un post</h4>
        <form onSubmit={handleNewPostSubmit}>
          <textarea
            className="form-control mb-2"
            placeholder="Exprime-toi..."
            rows={3}
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
          />
          <button className="btn btn-success" type="submit">Publier</button>
        </form>
      </section>

      {/* Section posts */}
      <section className="mb-5">
        <h4>Fil d’actualité</h4>
        {posts.length === 0 && <p>Aucun post trouvé</p>}
        {posts.map(post => (
          <div key={post.id} className="border p-3 mb-3 rounded">
            <strong>{post.author.username}</strong> <br />
            <p>{post.content}</p>
            <div className="d-flex align-items-center gap-3">
              <button
                className={`btn btn-sm ${post.user_liked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={16} /> {post.likes_count}
              </button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => openComments(post.id)}>
                <MessageCircle size={16} /> {post.comments_count}
              </button>
            </div>
          </div>
        ))}

        {/* Commentaires */}
        {showCommentsPostId && (
          <div className="border p-3 rounded mb-5">
            <h5>Commentaires</h5>
            {comments.length === 0 && <p>Aucun commentaire</p>}
            {comments.map(c => (
              <div key={c.id} className="mb-2">
                <strong>{c.author.username}</strong>: {c.content}
              </div>
            ))}
            <textarea
              className="form-control"
              rows={2}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={addComment}>
              Envoyer
            </button>
            <button className="btn btn-secondary mt-2 ms-2" onClick={() => setShowCommentsPostId(null)}>
              Fermer
            </button>
          </div>
        )}
      </section>

      {/* Section demandes d'amis */}
      <section className="mb-5">
        <h4>
          <UserPlus size={20} /> Demandes d’amis
        </h4>
        {friendRequests.length === 0 && <p>Aucune demande d’ami en attente.</p>}
        {friendRequests.map(req => (
          <div key={req.id} className="d-flex justify-content-between align-items-center border p-2 rounded mb-2">
            <span>{req.sender.username}</span>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => respondFriendRequest(req.id, true)}
              >
                <CheckCircle size={16} /> Accepter
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => respondFriendRequest(req.id, false)}
              >
                <XCircle size={16} /> Refuser
              </button>
            </div>
          </div>
        ))}

        <div className="mt-3">
          <input
            type="number"
            className="form-control"
            placeholder="ID utilisateur à ajouter"
            value={newFriendId}
            onChange={e => setNewFriendId(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={sendFriendRequest}>
            Envoyer demande
          </button>
        </div>
      </section>

      {/* Section amis */}
      <section className="mb-5">
        <h4>
          <Users size={20} /> Amis
        </h4>
        {friends.length === 0 && <p>Pas encore d’amis.</p>}
        <ul className="list-group">
          {friends.map(f => (
            <li key={f.id} className="list-group-item">
              {f.username}
            </li>
          ))}
        </ul>
      </section>

      {/* Section conversations */}
      <section className="mb-5">
        <h4>Conversations récentes</h4>
        {conversations.length === 0 && <p>Aucune conversation.</p>}
        {conversations.map(conv => (
          <div key={conv.user.id} className="border p-2 rounded mb-2">
            <strong>{conv.user.username}</strong>
            <div>
              Dernier message: {conv.last_message ? conv.last_message.content : 'Aucun'}
            </div>
            {conv.unread_count > 0 && (
              <span className="badge bg-danger">{conv.unread_count} non lus</span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
