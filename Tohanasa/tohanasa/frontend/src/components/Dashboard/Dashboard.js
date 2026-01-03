// Dashboard.js - Tableau de bord unifié
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const Dashboard = ({ token, isAuthenticated, onLogout }) => {
    const [formations, setFormations] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newFormation, setNewFormation] = useState({
        title: '',
        institution: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    // Fonction pour récupérer les formations de l'utilisateur
    const fetchFormations = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/formations/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormations(response.data);
        } catch (error) {
            setMessage('Erreur lors de la récupération des formations.');
            setMessageType('error');
        }
    }, [token]);

    // Fonction pour supprimer une formation
    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
            return;
        }
        
        try {
            await axios.delete(`http://localhost:8081/api/formations/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFormations();
            setMessage('Formation supprimée avec succès !');
            setMessageType('success');
        } catch (error) {
            setMessage('Erreur lors de la suppression de la formation.');
            setMessageType('error');
        }
    };

    // Fonction pour ajouter une nouvelle formation
    const handleAddFormation = async (event) => {
        event.preventDefault();
        if (!token) {
            setMessage('Vous devez être connecté pour ajouter une formation.');
            setMessageType('error');
            return;
        }
        
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8081/api/formations/', newFormation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFormations();
            setNewFormation({ title: '', institution: '', start_date: '', end_date: '', description: '' });
            setMessage('Formation ajoutée avec succès !');
            setMessageType('success');
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(`Erreur lors de l'ajout de la formation : ${error.response.data.detail || 'Détails non fournis.'}`);
            } else {
                setMessage('Erreur lors de l\'ajout de la formation.');
            }
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFormations();
    }, [fetchFormations]);

    return (
        <div className="page-container">
            <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <div className="page-content">
                {/* En-tête de bienvenue */}
                <div className="card animate-fade-in-up">
                    <div className="card-header">
                        <h1 className="card-title">Tableau de bord</h1>
                        <p className="card-subtitle">Gérez vos formations et suivez votre progression</p>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className={`message message-${messageType}`}>
                        {message}
                    </div>
                )}

                {/* Section d'ajout de formation */}
                <div className="section animate-fade-in-up delay-200">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="section-title">Ajouter une Formation</h2>
                            <p className="section-subtitle">Enrichissez votre profil avec vos formations</p>
                        </div>
                        
                        <form onSubmit={handleAddFormation} className="grid grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Titre de la formation</label>
                                <input 
                                    type="text" 
                                    value={newFormation.title} 
                                    onChange={(e) => setNewFormation({ ...newFormation, title: e.target.value })} 
                                    placeholder="Ex: Développement Web Full Stack" 
                                    required 
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Institution</label>
                                <input 
                                    type="text" 
                                    value={newFormation.institution} 
                                    onChange={(e) => setNewFormation({ ...newFormation, institution: e.target.value })} 
                                    placeholder="Ex: Université de Madagascar" 
                                    required 
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Date de début</label>
                                <input 
                                    type="date" 
                                    value={newFormation.start_date} 
                                    onChange={(e) => setNewFormation({ ...newFormation, start_date: e.target.value })} 
                                    required 
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Date de fin</label>
                                <input 
                                    type="date" 
                                    value={newFormation.end_date} 
                                    onChange={(e) => setNewFormation({ ...newFormation, end_date: e.target.value })} 
                                    required 
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Description</label>
                                <textarea 
                                    value={newFormation.description} 
                                    onChange={(e) => setNewFormation({ ...newFormation, description: e.target.value })} 
                                    placeholder="Décrivez le contenu de la formation, les compétences acquises..." 
                                    required 
                                    className="form-input form-textarea"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div style={{ gridColumn: 'span 2' }}>
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading && <div className="loading-spinner"></div>}
                                    
                                    {isLoading ? 'Ajout en cours...' : 'Ajouter la Formation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Section des formations */}
                <div className="section animate-fade-in-up delay-400">
                    <div className="section-header">
                        <h2 className="section-title">Mes Formations</h2>
                        <p className="section-subtitle">
                            {formations.length === 0 
                                ? "Aucune formation ajoutée pour le moment" 
                                : `${formations.length} formation${formations.length > 1 ? 's' : ''} enregistrée${formations.length > 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    
                    {formations.length === 0 ? (
                        <div className="card text-center">
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>📚</div>
                            <h3 className="text-muted mb-4">Aucune formation pour le moment</h3>
                            <p className="text-muted">Commencez par ajouter votre première formation ci-dessus !</p>
                        </div>
                    ) : (
                        <div className="grid grid-responsive">
                            {formations.map((formation, index) => (
                                <div 
                                    key={formation.id} 
                                    className="list-item animate-fade-in-up"
                                    style={{ animationDelay: `${0.1 * index}s` }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-primary mb-2">{formation.title}</h3>
                                            <p className="font-semibold text-muted mb-2">{formation.institution}</p>
                                            <p className="text-sm text-muted">
                                                {new Date(formation.start_date).toLocaleDateString('fr-FR')} - {new Date(formation.end_date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(formation.id)}
                                            className="btn btn-danger"
                                            style={{ padding: 'var(--spacing-2) var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                    
                                    <div className="p-4 bg-primary rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                                        <span className="text-xs font-semibold text-primary bg-primary rounded-full px-3 py-1" style={{ backgroundColor: 'var(--primary-100)' }}>
                                            Formation
                                        </span>
                                    </div>
                                    
                                    <p className="text-muted mt-4">{formation.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;