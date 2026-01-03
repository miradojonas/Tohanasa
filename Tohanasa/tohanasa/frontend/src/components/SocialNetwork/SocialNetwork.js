
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './SocialNetwork.css';

const SocialNetwork = ({ token, isAuthenticated, onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    // Headers pour les requêtes API
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Charger les posts
    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://0.0.0.0:8081/api/posts/', {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            setError('Erreur lors du chargement des posts');
        } finally {
            setLoading(false);
        }
    };

    // Charger les amis
    const loadFriends = async () => {
        try {
            const response = await fetch('http://0.0.0.0:8081/api/friends/', {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setFriends(data);
            }
        } catch (error) {
            setError('Erreur lors du chargement des amis');
        }
    };

    // Charger les demandes d'amis
    const loadFriendRequests = async () => {
        try {
            const response = await fetch('http://0.0.0.0:8081/api/friends/requests/', {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data);
            }
        } catch (error) {
            setError('Erreur lors du chargement des demandes d\'amis');
        }
    };

    // Charger les messages avec un ami
    const loadMessages = async (friendId) => {
        try {
            const response = await fetch(`http://0.0.0.0:8081/api/messages/?friend_id=${friendId}`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            setError('Erreur lors du chargement des messages');
        }
    };

    // Publier un nouveau post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const response = await fetch('http://0.0.0.0:8081/api/posts/', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content: newPost })
            });

            if (response.ok) {
                setNewPost('');
                loadPosts();
            }
        } catch (error) {
            setError('Erreur lors de la création du post');
        }
    };

    // Liker un post
    const handleLikePost = async (postId) => {
        try {
            const response = await fetch(`http://0.0.0.0:8081/api/posts/${postId}/like/`, {
                method: 'POST',
                headers: getHeaders()
            });

            if (response.ok) {
                loadPosts();
            }
        } catch (error) {
            setError('Erreur lors du like');
        }
    };

    // Rechercher des utilisateurs
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await fetch(`http://0.0.0.0:8081/api/users/search/?q=${searchQuery}`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            }
        } catch (error) {
            setError('Erreur lors de la recherche');
        }
    };

    // Envoyer une demande d'ami
    const sendFriendRequest = async (userId) => {
        try {
            const response = await fetch(`http://0.0.0.0:8081/api/friends/request/${userId}/`, {
                method: 'POST',
                headers: getHeaders()
            });

            if (response.ok) {
                setSearchResults(searchResults.filter(user => user.id !== userId));
                alert('Demande d\'ami envoyée !');
            }
        } catch (error) {
            setError('Erreur lors de l\'envoi de la demande');
        }
    };

    // Répondre à une demande d'ami
    const respondFriendRequest = async (friendshipId, accept) => {
        try {
            const response = await fetch(`http://0.0.0.0:8081/api/friends/respond/${friendshipId}/`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ accept })
            });

            if (response.ok) {
                loadFriendRequests();
                if (accept) loadFriends();
            }
        } catch (error) {
            setError('Erreur lors de la réponse');
        }
    };

    // Envoyer un message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend) return;

        try {
            const response = await fetch('http://0.0.0.0:8081/api/messages/', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    content: newMessage,
                    receiver: selectedFriend.id
                })
            });

            if (response.ok) {
                setNewMessage('');
                loadMessages(selectedFriend.id);
            }
        } catch (error) {
            setError('Erreur lors de l\'envoi du message');
        }
    };

    useEffect(() => {
        if (activeTab === 'posts') {
            loadPosts();
        } else if (activeTab === 'friends') {
            loadFriends();
            loadFriendRequests();
        } else if (activeTab === 'messages') {
            loadFriends();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedFriend) {
            loadMessages(selectedFriend.id);
        }
    }, [selectedFriend]);

    return (
        <div className="social-network">
            <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            
            <div className="social-container">
                <div className="social-header">
                    <h1>Réseau Social</h1>
                    <div className="tab-navigation">
                        <button
                            className={activeTab === 'posts' ? 'active' : ''}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            className={activeTab === 'friends' ? 'active' : ''}
                            onClick={() => setActiveTab('friends')}
                        >
                            Amis
                        </button>
                        <button
                            className={activeTab === 'messages' ? 'active' : ''}
                            onClick={() => setActiveTab('messages')}
                        >
                            Messages
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {activeTab === 'posts' && (
                    <div className="posts-section">
                        <form onSubmit={handleCreatePost} className="create-post">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Que voulez-vous partager ?"
                                rows="3"
                            />
                            <button type="submit" disabled={!newPost.trim()}>
                                Publier
                            </button>
                        </form>

                        <div className="posts-list">
                            {posts.map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <strong>{post.author_name}</strong>
                                        <span className="post-date">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                    <div className="post-actions">
                                        <button onClick={() => handleLikePost(post.id)}>
                                            👍 {post.likes_count}
                                        </button>
                                        <span>💬 {post.comments_count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div className="friends-section">
                        <div className="search-users">
                            <div className="search-form">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher des utilisateurs..."
                                />
                                <button onClick={handleSearch}>Rechercher</button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    <h3>Résultats de recherche</h3>
                                    {searchResults.map(user => (
                                        <div key={user.id} className="user-card">
                                            <span>{user.username}</span>
                                            <button onClick={() => sendFriendRequest(user.id)}>
                                                Ajouter
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {friendRequests.length > 0 && (
                            <div className="friend-requests">
                                <h3>Demandes d'amis</h3>
                                {friendRequests.map(request => (
                                    <div key={request.id} className="request-card">
                                        <span>{request.from_user_name}</span>
                                        <div className="request-actions">
                                            <button onClick={() => respondFriendRequest(request.id, true)}>
                                                Accepter
                                            </button>
                                            <button onClick={() => respondFriendRequest(request.id, false)}>
                                                Refuser
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="friends-list">
                            <h3>Mes amis</h3>
                            {friends.map(friend => (
                                <div key={friend.id} className="friend-card">
                                    <span>{friend.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="messages-section">
                        <div className="messages-container">
                            <div className="friends-sidebar">
                                <h3>Conversations</h3>
                                {friends.map(friend => (
                                    <div
                                        key={friend.id}
                                        className={`friend-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                                        onClick={() => setSelectedFriend(friend)}
                                    >
                                        {friend.name}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-area">
                                {selectedFriend ? (
                                    <>
                                        <div className="chat-header">
                                            <h3>Conversation avec {selectedFriend.name}</h3>
                                        </div>
                                        <div className="messages-list">
                                            {messages.map(message => (
                                                <div
                                                    key={message.id}
                                                    className={`message ${message.is_sent ? 'sent' : 'received'}`}
                                                >
                                                    <div className="message-content">{message.content}</div>
                                                    <div className="message-time">
                                                        {new Date(message.created_at).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleSendMessage} className="message-form">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Tapez votre message..."
                                            />
                                            <button type="submit" disabled={!newMessage.trim()}>
                                                Envoyer
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="no-chat-selected">
                                        Sélectionnez un ami pour commencer une conversation
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="loading">Chargement...</div>}
            </div>
        </div>
    );
};

export default SocialNetwork;
