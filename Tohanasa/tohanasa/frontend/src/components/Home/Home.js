// src/components/Home.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Home.css';
import { Link } from 'react-router-dom';

function Home({ isAuthenticated, onLogout }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/api/hello/')
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="home">
            <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <div className="home-container">
                <div className="welcome-section">
                    <h1>Bienvenue sur Tohan'asa</h1>
                    <p className="subtitle">La plateforme qui vous aide à trouver du travail en quelques clics et bénéficier de formations gratuites.</p>
                    {message && <p className="api-message">{message}</p>}
                    
                    
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="dashboard-button">
                            Accéder au Tableau de bord
                        </Link>
                    ) : (
                        <Link to="/login" className="dashboard-button">
                            Se connecter pour commencer
                        </Link>
                    )}
                </div>
                
                <div className="features-section">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">💼</div>
                            <h3>Recherche d'emploi</h3>
                            <p>Trouvez des opportunités d'emploi adaptées à votre profil grâce à notre système de matching intelligent.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎓</div>
                            <h3>Formations professionnelles</h3>
                            <p>Développez vos compétences avec nos formations certifiantes et programmes de développement professionnel.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📄</div>
                            <h3>CV optimisé</h3>
                            <p>Créez un CV professionnel qui se démarque avec nos outils de création et conseils d'experts.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📄</div>
                            <h3>Réseau</h3>
                            <p>Bénéficier d'un réseautage professionnel pour mieux décoller son carrière.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-message">
                © 2025 Tohan'asa. Tous droits réservés.
            </div>
        </div>
    );
}

export default Home;