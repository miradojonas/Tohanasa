// frontend/src/components/cv/CVForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './CVForm.css'; // Importer le fichier CSS pour le style

const CVForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');
    const [cvId, setCvId] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:8081/api/cv/', {
                name,
                email,
                phone,
                experience,
                education,
                skills,
            });
            setCvId(response.data.id);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error.response.data);
            setError('Une erreur s\'est produite lors de la création du CV.');
        }
    };

    const handleDownload = async () => {
        if (!cvId) return;
        try {
            const response = await axios.get(`http://localhost:8081/api/cv/pdf/${cvId}/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CV.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            setError('Une erreur s\'est produite lors du téléchargement du CV.');
        }
    };

    return (
        <div className="cv-form-page">
            <div className="cv-form-container">
                <div className="cv-form-wrapper">
                    <h2>Créer un CV</h2>
                    <p className="cv-form-subtitle">Remplissez les informations ci-dessous pour générer votre CV professionnel</p>
                    
                    <form onSubmit={handleSubmit} className="cv-form">
                        <div className="form-group">
                            <label className="form-label">Nom complet</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Entrez votre nom complet" 
                                required 
                                className="cv-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Adresse email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="votre.email@exemple.com" 
                                required 
                                className="cv-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Numéro de téléphone</label>
                            <input 
                                type="text" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="+33 1 23 45 67 89" 
                                required 
                                className="cv-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Expérience professionnelle</label>
                            <textarea 
                                value={experience} 
                                onChange={(e) => setExperience(e.target.value)} 
                                placeholder="Décrivez votre expérience professionnelle, vos postes précédents et vos responsabilités..." 
                                required 
                                className="cv-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Formation et éducation</label>
                            <textarea 
                                value={education} 
                                onChange={(e) => setEducation(e.target.value)} 
                                placeholder="Listez vos diplômes, formations et établissements d'enseignement..." 
                                required 
                                className="cv-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Compétences</label>
                            <textarea 
                                value={skills} 
                                onChange={(e) => setSkills(e.target.value)} 
                                placeholder="Listez vos compétences techniques, linguistiques et personnelles..." 
                                required 
                                className="cv-textarea"
                            />
                        </div>

                        <div className="cv-buttons">
                            <button type="submit" className="cv-button">Créer CV</button>
                            <button 
                                type="button" 
                                onClick={handleDownload} 
                                className="cv-button"
                                disabled={!cvId}
                            >
                                Télécharger PDF
                            </button>
                        </div>
                        
                        {error && <p className="error-message">{error}</p>}
                        
                        {cvId && !error && <p className="success-message">CV créé avec succès ! Vous pouvez maintenant le télécharger.</p>}
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CVForm;