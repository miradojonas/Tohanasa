// src/components/job/JobSearchAndAdd.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PlusCircle, Briefcase, MapPin } from 'lucide-react';

const JobSearchAndAdd = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    jobType: 'Full-Time'
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/jobs/search/`, {
        params: { keyword, location }
      });

      // ⚠️ Parsing HTML car le backend retourne un template
      const parser = new DOMParser();
      const doc = parser.parseFromString(res.data, 'text/html');
      const jobElements = doc.querySelectorAll('.job');

      const extractedJobs = Array.from(jobElements).map(el => ({
        title: el.querySelector('.title')?.textContent,
        company: el.querySelector('.company')?.textContent,
        location: el.querySelector('.location')?.textContent
      }));

      setJobs(extractedJobs);
    } catch (error) {
      console.error('Erreur lors du chargement des jobs:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8081/api/jobs/`, form);
      alert('Job ajouté avec succès');
      setForm({ title: '', company: '', location: '', description: '', jobType: 'Full-Time' });
      fetchJobs();
    } catch (error) {
      console.error('Erreur lors de l’ajout du job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [keyword, location]);

  return (
    <div className="container py-4">
      <h2 className="mb-3 text-primary"><Search className="me-2" />Recherche d'emploi</h2>

      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Mot-clé"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Localisation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <hr />

      <h2 className="mt-4 text-success"><PlusCircle className="me-2" />Ajouter un emploi</h2>
      <form onSubmit={handleAddJob} className="row g-3 mt-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Titre"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Entreprise"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Localisation"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={form.jobType}
            onChange={e => setForm({ ...form, jobType: e.target.value })}
          >
            <option value="Full-Time">Temps plein</option>
            <option value="Part-Time">Temps partiel</option>
            <option value="Internship">Stage</option>
            <option value="Remote">Télétravail</option>
            <option value="Contract">Contractuel</option>
          </select>
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            placeholder="Description"
            rows="4"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            <PlusCircle className="me-2" size={18} />Ajouter
          </button>
        </div>
      </form>

      <hr className="my-4" />

      <h2 className="text-secondary mb-3"><Briefcase className="me-2" />Résultats</h2>
      {jobs.length === 0 && <p className="text-muted">Aucun emploi trouvé.</p>}
      <div className="row">
        {jobs.map((job, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text mb-1"><Briefcase size={16} className="me-1" />{job.company}</p>
                <p className="card-text"><MapPin size={16} className="me-1" />{job.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearchAndAdd;
