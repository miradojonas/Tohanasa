// src/components/job/AddJob.js
import React, { useState } from 'react';
import axios from 'axios';

function AddJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    jobType: 'Full-Time',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/jobs/', form, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Offre publiée !');
      setForm({
        title: '',
        company: '',
        location: '',
        description: '',
        jobType: 'Full-Time',
      });
    } catch (error) {
      console.error('Erreur publication :', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Publier une offre</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input name="title" type="text" className="form-control" placeholder="Titre du poste" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input name="company" type="text" className="form-control" placeholder="Entreprise" value={form.company} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input name="location" type="text" className="form-control" placeholder="Lieu" value={form.location} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <select name="jobType" className="form-select" value={form.jobType} onChange={handleChange}>
            <option value="Full-Time">Temps plein</option>
            <option value="Part-Time">Temps partiel</option>
            <option value="Internship">Stage</option>
            <option value="Remote">Télétravail</option>
            <option value="Contract">Contractuel</option>
          </select>
        </div>
        <div className="mb-2">
          <textarea name="description" className="form-control" rows="4" placeholder="Description du poste" value={form.description} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Publier</button>
      </form>
    </div>
  );
}

export default AddJob;
