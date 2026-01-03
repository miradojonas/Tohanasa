// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import CVForm from './components/cv/CVForm';
import FormationForm from './components/FormationForm/FormationForm';
import Dashboard from './components/Dashboard/Dashboard';
import JobPage from './components/job/JobPage';
import JobSearch from './components/job/JobSearch';
import JobList from './components/job/JobList';
import AuthForm from './components/AuthForm/AuthForm';
import CourseList from './components/CourseList/CourseList';
import AddJob from './components/job/AddJob'; // Importez le composant AddJob
import './styles/global.css';
import SocialNetwork from './components/SocialNetwork/SocialNetwork';
import Chatbot from './components/Chatbot/Chatbot'; // Import du chatbot

function App() {
    const [token, setToken] = useState(() => {
        // Récupérer le token depuis localStorage au démarrage
        return localStorage.getItem('authToken');
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    const isAuthenticated = () => {
        return token !== null;
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <Router>
            <div className="app">
                <main className="app-main">
                    <Routes>
                        {/* Toutes tes routes inchangées */}
                        <Route 
                            path="/" 
                            element={
                                <Home 
                                    isAuthenticated={isAuthenticated()} 
                                    onLogout={handleLogout} 
                                />
                            } 
                        />
                        {/* ... toutes les autres routes ... */}
                        <Route 
                            path="/login" 
                            element={
                                isAuthenticated() ? 
                                <Navigate to="/dashboard" replace /> : 
                                <AuthForm setToken={setToken} mode="login" />
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                isAuthenticated() ? 
                                <Navigate to="/dashboard" replace /> : 
                                <AuthForm setToken={setToken} mode="register" />
                            } 
                        />
                        <Route path="/registerform" element={<Navigate to="/register" replace />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                isAuthenticated() ? 
                                <Dashboard token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route 
                            path="/cv" 
                            element={
                                isAuthenticated() ? 
                                <CVForm token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route 
                            path="/formations" 
                            element={
                                isAuthenticated() ? 
                                <FormationForm token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route 
                            path="/courses" 
                            element={
                                <CourseList isAuthenticated={isAuthenticated()} onLogout={handleLogout} />
                            } 
                        />
                        <Route 
                            path="/job-search" 
                            element={
                                isAuthenticated() ? 
                                <JobSearch token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route 
                            path="/social-network" 
                            element={
                                isAuthenticated() ? 
                                <JobList token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route path="/add-job" element={<AddJob />} />
                        <Route 
                            path="/jobs/:id" 
                            element={
                                isAuthenticated() ? 
                                <JobPage token={token} isAuthenticated={isAuthenticated()} onLogout={handleLogout} /> : 
                                <Navigate to="/login" replace />
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                {/* Chatbot visible sur toutes les pages */}
                <Chatbot />

            </div>
        </Router>
    );
}

export default App;
