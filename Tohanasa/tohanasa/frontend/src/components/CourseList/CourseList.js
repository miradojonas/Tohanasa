   // CourseList.js - Liste des cours avec design unifié
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const CourseList = ({ isAuthenticated, onLogout }) => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/courses/');
            setCourses(response.data);
        } catch (error) {
            setMessage('Erreur lors de la récupération des cours.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <div className="page-content">
                {/* En-tête */}
                <div className="section animate-fade-in-up">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Formations Gratuites</h1>
                            <p className="card-subtitle">Découvrez une sélection de formations gratuites de qualité</p>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-6 text-center">
                            <div>
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>🆓</div>
                                <h4 className="font-semibold text-sm">100% Gratuit</h4>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>🏆</div>
                                <h4 className="font-semibold text-sm">Certifié</h4>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>⏰</div>
                                <h4 className="font-semibold text-sm">À votre rythme</h4>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>🌍</div>
                                <h4 className="font-semibold text-sm">En ligne</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className={`message message-${messageType}`}>
                        {message}
                    </div>
                )}

                {/* Liste des cours */}
                <div className="section animate-fade-in-up delay-200">
                    <div className="section-header">
                        <h2 className="section-title">Cours Disponibles</h2>
                        <p className="section-subtitle">
                            {isLoading 
                                ? "Chargement des cours..." 
                                : courses.length === 0 
                                    ? "Aucun cours disponible pour le moment" 
                                    : `${courses.length} cours gratuit${courses.length > 1 ? 's' : ''} disponible${courses.length > 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    
                    {isLoading ? (
                        <div className="card text-center">
                            <div className="loading-spinner" style={{ margin: '0 auto var(--spacing-4)' }}></div>
                            <p className="text-muted">Chargement des cours...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="card text-center">
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>📚</div>
                            <h3 className="text-muted mb-4">Aucun cours disponible</h3>
                            <p className="text-muted">Les cours seront bientôt disponibles. Revenez plus tard !</p>
                        </div>
                    ) : (
                        <div className="grid grid-responsive">
                            {courses.map((course, index) => (
                                <div 
                                    key={course.id} 
                                    className="list-item animate-fade-in-up"
                                    style={{ animationDelay: `${0.1 * index}s` }}
                                >
                                    <div className="mb-4">
                                        <h3 className="font-bold text-primary mb-2">{course.title}</h3>
                                        <div className="flex gap-2 mb-3">
                                            <span className="text-xs font-semibold text-secondary bg-secondary rounded-full px-3 py-1" style={{ backgroundColor: 'var(--secondary-100)' }}>
                                                🆓 Gratuit
                                            </span>
                                            <span className="text-xs font-semibold text-primary bg-primary rounded-full px-3 py-1" style={{ backgroundColor: 'var(--primary-100)' }}>
                                                🎓 Certifiant
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {course.description && (
                                        <p className="text-muted mb-4">{course.description}</p>
                                    )}
                                    
                                    <div className="flex gap-2">
                                        <a 
                                            href={course.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-2) var(--spacing-4)' }}
                                        >
                                            🚀 Commencer le cours
                                        </a>
                                        <button 
                                            className="btn btn-outline"
                                            style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-2) var(--spacing-4)' }}
                                        >
                                            ⭐ Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseList;