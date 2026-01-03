
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Note: Ces modèles sont pour référence, Django utilisera ses propres modèles
// Voici la structure équivalente en Django models.py

module.exports = {
  // Structure de référence pour les modèles Django
  UserProfile: {
    user: 'OneToOneField to User',
    bio: 'TextField',
    avatar: 'ImageField',
    birth_date: 'DateField',
    location: 'CharField',
    website: 'URLField',
    created_at: 'DateTimeField',
    updated_at: 'DateTimeField'
  },
  
  Post: {
    author: 'ForeignKey to User',
    content: 'TextField',
    image: 'ImageField',
    created_at: 'DateTimeField',
    updated_at: 'DateTimeField',
    likes_count: 'IntegerField'
  },
  
  Friendship: {
    user1: 'ForeignKey to User',
    user2: 'ForeignKey to User',
    status: 'CharField', // pending, accepted, blocked
    created_at: 'DateTimeField'
  },
  
  Message: {
    sender: 'ForeignKey to User',
    recipient: 'ForeignKey to User',
    content: 'TextField',
    is_read: 'BooleanField',
    created_at: 'DateTimeField'
  },
  
  Like: {
    user: 'ForeignKey to User',
    post: 'ForeignKey to Post',
    created_at: 'DateTimeField'
  }
};
