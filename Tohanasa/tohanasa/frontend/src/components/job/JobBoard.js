import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    jobType: 'Full-Time',
  });
  const [filters, setFilters] = useState({
    keyword: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`/api/jobs/search/?keyword=${filters.keyword}&location=${filters.location}`);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, "text/html");

      // Récupère les éléments directement depuis le HTML retourné (simplifié)
      const parsedJobs = Array.from(doc.querySelectorAll("li.job-item")).map(el => ({
        title: el.querySelector(".title")?.textContent || '',
        company: el.querySelector(".company")?.textContent || '',
        location: el.querySelector(".location")?.textContent || '',
        description: el.querySelector(".description")?.textContent || '',
      }));

      setJobs(parsedJobs);
    } catch (error) {
      console.error("Erreur lors du chargement des offres :", error);
    }
  };

  const handleInputChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleFilterChange = (e) => {
    setFilters({...filters, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs/', form);
      setForm({
        title: '',
        company: '',
        location: '',
        description: '',
        jobType: 'Full-Time',
      });
      fetchJobs(); // recharger la liste
    } catch (error) {
      console.error("Erreur lors de la création d'une offre :", error.response.data);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Rechercher des offres</h2>
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-5">
          <input type="text" name="keyword" className="form-control" placeholder="Mot-clé" value={filters.keyword} onChange={handleFilterChange} />
        </div>
        <div className="col-md-5">
          <input type="text" name="location" className="form-control" placeholder="Lieu" value={filters.location} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Rechercher</button>
        </div>
      </form>

      <h3>Créer une offre</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input type="text" name="title" className="form-control" placeholder="Titre" value={form.title} onChange={handleInputChange} required />
        </div>
        <div className="mb-2">
          <input type="text" name="company" className="form-control" placeholder="Entreprise" value={form.company} onChange={handleInputChange} required />
        </div>
        <div className="mb-2">
          <input type="text" name="location" className="form-control" placeholder="Lieu" value={form.location} onChange={handleInputChange} required />
        </div>
        <div className="mb-2">
          <select name="jobType" className="form-select" value={form.jobType} onChange={handleInputChange}>
            <option value="Full-Time">Temps plein</option>
            <option value="Part-Time">Temps partiel</option>
            <option value="Internship">Stage</option>
            <option value="Remote">Télétravail</option>
            <option value="Contract">Contractuel</option>
          </select>
        </div>
        <div className="mb-2">
          <textarea name="description" className="form-control" placeholder="Description" rows="4" value={form.description} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="btn btn-success">Publier</button>
      </form>

      <h3>Liste des offres</h3>
      {jobs.length === 0 ? <p>Aucune offre trouvée.</p> : (
        <ul className="list-group">
          {jobs.map((job, index) => (
            <li key={index} className="list-group-item">
              <h5>{job.title} <span className="badge bg-secondary">{job.location}</span></h5>
              <p><strong>{job.company}</strong></p>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobBoard;
