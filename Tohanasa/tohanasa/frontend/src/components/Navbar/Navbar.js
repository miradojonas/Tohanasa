// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Tohan'asa
                </Link>
                
                {isAuthenticated && (
                    <ul className="nav-left">
                        <li className="animate__animated animate__fadeIn">
                            <Link to="/dashboard">
                                <span>🏠</span>
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.1s' }}>
                            <Link to="/cv">
                                <span>👤</span>
                                <span>CV</span>
                            </Link>
                        </li>
                        <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.2s' }}>
                            <Link to="/formations">
                                <span>📚</span>
                                <span>Formations</span>
                            </Link>
                        </li>
                        <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.3s' }}>
                            <Link to="/job-search">
                                <span>💼</span>
                                <span>Recherche d'emploi</span>
                            </Link>
                        </li>
                        <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.4s' }}>
                            <Link to="/social-network">
                                <span>📋</span>
                                <span>Réseau</span>
                            </Link>
                        </li>
                    </ul>
                )}
                
                <ul className="nav-right">
                    {isAuthenticated ? (
                        <li className="animate__animated animate__fadeIn">
                            <button onClick={handleLogout} className="logout-button">
                                <span>🚪</span>
                                <span>Se déconnecter</span>
                            </button>
                        </li>
                    ) : (
                        <>
                            <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.5s' }}>
                                <Link to="/register">
                                    <span>👤</span>
                                    <span>S'inscrire</span>
                                </Link>
                            </li>
                            <li className="animate__animated animate__fadeIn" style={{ animationDelay: '0.6s' }}>
                                <Link to="/login" className="button">
                                    <span>🔒</span>
                                    <span>Se connecter</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;