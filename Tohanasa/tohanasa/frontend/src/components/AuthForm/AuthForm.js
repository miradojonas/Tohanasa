// AuthForm.js - Composant d'authentification unifié
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ setToken, mode: initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    // Synchroniser le mode avec la prop initiale
    useEffect(() => {
        setMode(initialMode);
        resetForm();
    }, [initialMode]);

    // Réinitialiser le formulaire lors du changement de mode
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setMessage('');
        setFieldErrors({});
        setPasswordStrength(0);
        setShowPassword(false);
        setIsSuccess(false);
    };

    // Changer de mode (login/register)
    const switchMode = (newMode) => {
        if (newMode !== mode) {
            setMode(newMode);
            resetForm();
            // Naviguer vers la nouvelle route
            navigate(newMode === 'login' ? '/login' : '/register');
        }
    };

    // Validation en temps réel
    const validateField = (field, value) => {
        const errors = { ...fieldErrors };
        
        switch (field) {
            case 'username':
                if (value.length < 3) {
                    errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
                } else if (mode === 'register' && value.length > 30) {
                    errors.username = 'Le nom d\'utilisateur ne peut dépasser 30 caractères';
                } else if (mode === 'register' && !/^[a-zA-Z0-9_-]+$/.test(value)) {
                    errors.username = 'Seuls les lettres, chiffres, tirets et underscores sont autorisés';
                } else {
                    delete errors.username;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.email = 'Veuillez entrer une adresse email valide';
                } else {
                    delete errors.email;
                }
                break;
            case 'password':
                const minLength = mode === 'register' ? 8 : 6;
                if (value.length < minLength) {
                    errors.password = `Le mot de passe doit contenir au moins ${minLength} caractères`;
                } else if (mode === 'register' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
                } else {
                    delete errors.password;
                }
                break;
            default:
                break;
        }
        
        setFieldErrors(errors);
    };

    // Calcul de la force du mot de passe
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        
        if (mode === 'register') {
            // Longueur
            if (password.length >= 8) strength += 1;
            if (password.length >= 12) strength += 1;
            
            // Complexité
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
            if (password.match(/\d/)) strength += 1;
            if (password.match(/[^a-zA-Z\d]/)) strength += 1;
            
            return Math.min(strength, 4);
        } else {
            // Pour le login, calcul simplifié
            if (password.length >= 6) strength += 1;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
            if (password.match(/\d/)) strength += 1;
            return Math.min(strength, 3);
        }
    };

    // Gestion des changements de champs avec validation
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        validateField('username', value);
        
        if (message) {
            setMessage('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateField('email', value);
        
        if (message) {
            setMessage('');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validateField('password', value);
        setPasswordStrength(calculatePasswordStrength(value));
        
        if (message) {
            setMessage('');
        }
    };

    // Animation de succès
    const showSuccessAnimation = () => {
        setIsSuccess(true);
        setTimeout(() => {
            if (mode === 'register') {
                switchMode('login');
                setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            } else {
                navigate('/');
            }
        }, mode === 'register' ? 2000 : 1500);
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validation finale
        validateField('username', username);
        if (mode === 'register') {
            validateField('email', email);
        }
        validateField('password', password);
        
        if (Object.keys(fieldErrors).length > 0) {
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        
        try {
            let response;
            
            if (mode === 'register') {
                response = await axios.post('http://localhost:8081/api/auth/register/', {
                    username,
                    email,
                    password,
                });
                setMessage('Inscription réussie ! Redirection vers la connexion...');
            } else {
                response = await axios.post('http://localhost:8081/api/auth/token/', {
                    username,
                    password,
                });
                setToken(response.data.access);
                setMessage('Connexion réussie ! Redirection en cours...');
            }
            
            resetForm();
            showSuccessAnimation();
            
        } catch (error) {
            setIsLoading(false);
            
            if (mode === 'register') {
                if (error.response?.data?.error) {
                    setMessage(error.response.data.error);
                    
                    // Gestion des erreurs spécifiques
                    if (error.response.data.error.includes('utilisateur')) {
                        setFieldErrors({ username: 'Ce nom d\'utilisateur est déjà utilisé' });
                    } else if (error.response.data.error.includes('email')) {
                        setFieldErrors({ email: 'Cette adresse email est déjà utilisée' });
                    }
                } else {
                    setMessage('Une erreur s\'est produite. Veuillez réessayer.');
                }
            } else {
                if (error.response?.status === 401) {
                    setMessage('Identifiant ou mot de passe incorrect.');
                    setFieldErrors({
                        username: 'Vérifiez vos identifiants',
                        password: 'Vérifiez vos identifiants'
                    });
                } else {
                    setMessage('Une erreur s\'est produite. Veuillez réessayer.');
                }
            }
        }
    };

    // Basculer la visibilité du mot de passe
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Effet pour gérer le chargement
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, mode === 'register' ? 3000 : 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, mode]);

    // Obtenir la classe de force du mot de passe
    const getPasswordStrengthClass = () => {
        if (mode === 'register') {
            switch (passwordStrength) {
                case 1: return 'strength-weak';
                case 2: return 'strength-medium';
                case 3: return 'strength-good';
                case 4: return 'strength-strong';
                default: return '';
            }
        } else {
            switch (passwordStrength) {
                case 1: return 'strength-weak';
                case 2: return 'strength-medium';
                case 3: return 'strength-strong';
                default: return '';
            }
        }
    };

    // Obtenir le texte de force du mot de passe
    const getPasswordStrengthText = () => {
        if (mode === 'register') {
            switch (passwordStrength) {
                case 1: return 'Faible';
                case 2: return 'Moyen';
                case 3: return 'Bon';
                case 4: return 'Fort';
                default: return '';
            }
        } else {
            switch (passwordStrength) {
                case 1: return 'Faible';
                case 2: return 'Moyen';
                case 3: return 'Bon';
                default: return '';
            }
        }
    };

    return (
        <div className={`auth-page ${mode}-mode`}>
            <div className="auth-container">
                <div className="auth-header">
                    <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                    <p className="auth-subtitle">
                        {mode === 'login' 
                            ? 'Accédez à votre espace personnel' 
                            : 'Créez votre compte personnel'
                        }
                    </p>
                </div>

                <div className="mode-toggle">
                    <button 
                        type="button"
                        className={`mode-button ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => switchMode('login')}
                    >
                        Connexion
                    </button>
                    <button 
                        type="button"
                        className={`mode-button ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => switchMode('register')}
                    >
                        Inscription
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Nom d'utilisateur</label>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                value={username} 
                                onChange={handleUsernameChange}
                                placeholder={mode === 'login' 
                                    ? "Entrez votre nom d'utilisateur" 
                                    : "Choisissez un nom d'utilisateur"
                                }
                                required 
                                className={`auth-input ${fieldErrors.username ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            <span className="input-icon user-icon"></span>
                        </div>
                        {fieldErrors.username && (
                            <p className="field-error">{fieldErrors.username}</p>
                        )}
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Adresse email</label>
                            <div className="input-wrapper">
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={handleEmailChange}
                                    placeholder="Entrez votre adresse email" 
                                    required 
                                    className={`auth-input ${fieldErrors.email ? 'error' : ''}`}
                                    disabled={isLoading}
                                />
                                <span className="input-icon email-icon"></span>
                            </div>
                            {fieldErrors.email && (
                                <p className="field-error">{fieldErrors.email}</p>
                            )}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <div className="input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password} 
                                onChange={handlePasswordChange}
                                placeholder={mode === 'login' 
                                    ? "Entrez votre mot de passe" 
                                    : "Créez un mot de passe sécurisé"
                                }
                                required 
                                className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            <span className="input-icon lock-icon"></span>
                            <button 
                                type="button" 
                                className={`password-toggle ${showPassword ? 'hide' : 'show'}`}
                                onClick={togglePasswordVisibility}
                                disabled={isLoading}
                            >
                            </button>
                        </div>
                        
                        {/* Indicateur de force du mot de passe */}
                        {password && (
                            <div className={`strength-meter ${password ? 'visible' : ''}`}>
                                <div className={`strength-fill ${getPasswordStrengthClass()}`}></div>
                            </div>
                        )}
                        
                        {password && passwordStrength > 0 && (
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: mode === 'register' 
                                    ? (passwordStrength >= 3 ? '#3b82f6' : passwordStrength >= 2 ? '#f59e0b' : '#ef4444')
                                    : (passwordStrength >= 2 ? '#10b981' : passwordStrength >= 1 ? '#f59e0b' : '#ef4444'),
                                marginTop: '4px',
                                fontWeight: '500'
                            }}>
                                Force du mot de passe: {getPasswordStrengthText()}
                            </p>
                        )}
                        
                        {fieldErrors.password && (
                            <p className="field-error">{fieldErrors.password}</p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || Object.keys(fieldErrors).length > 0}
                    >
                        <div className="button-content">
                            {isLoading && <div className="loading-spinner"></div>}
                            
                            {isLoading 
                                ? (mode === 'login' ? 'Connexion en cours...' : 'Inscription en cours...')
                                : (mode === 'login' ? 'Se connecter' : 'S\'inscrire')
                            }
                        </div>
                    </button>
                </form>
                
                {message && (
                    <p className={isSuccess ? "success-message" : "error-message"}>
                        {message}
                    </p>
                )}

                <div className="auth-footer">
                    <p>
                        {mode === 'login' 
                            ? "Vous n'avez pas de compte ? " 
                            : "Déjà un compte ? "
                        }
                        <button 
                            type="button"
                            className="switch-link"
                            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        >
                            {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;