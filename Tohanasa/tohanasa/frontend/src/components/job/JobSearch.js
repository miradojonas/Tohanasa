// src/components/job/JobSearch.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Bell } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:8081/api/jobs/';

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setJobs(res.data);
        setFilteredJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement jobs:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const lower = searchKeyword.toLowerCase();
    setFilteredJobs(
      jobs.filter(job =>
        (job.title?.toLowerCase() || '').includes(lower) ||
        (job.company?.toLowerCase() || '').includes(lower) ||
        (job.location?.toLowerCase() || '').includes(lower) ||
        (job.description?.toLowerCase() || '').includes(lower)
      )
    );
  }, [searchKeyword, jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newJob);
      alert('Emploi ajouté avec succès !');
      const updated = [...jobs, response.data];
      setJobs(updated);
      setFilteredJobs(updated);
      setShowForm(false);
      setNewJob({ title: '', company: '', location: '', description: '' });
    } catch (err) {
      console.error('Erreur ajout emploi:', err);
      alert("Erreur lors de l'ajout de l'emploi.");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet emploi ?')) return;
    axios.delete(`${API_URL}${id}/`)
      .then(() => {
        const updated = jobs.filter(job => job.id !== id);
        setJobs(updated);
        setFilteredJobs(updated);
      })
      .catch(err => {
        console.error('Erreur suppression emploi:', err);
        alert("Erreur : vous n'avez pas la permission de supprimer cet emploi.");
      });
  };

  const handleApply = (job) => {
    alert(`Vous avez postulé à : ${job.title}`);
    const notif = {
      message: `Un candidat a postulé à l’offre : ${job.title}`,
      timestamp: new Date().toLocaleString()
    };
    setNotifications([notif, ...notifications]);
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Offres d'emploi</h1>
        <div>
          <button className="btn btn-outline-dark me-3" title="Notifications" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="badge bg-danger ms-1">{notifications.length}</span>
            )}
          </button>
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} className="me-1" /> Publier un emploi
          </button>
        </div>
      </div>

      {showNotifs && (
        <div className="mb-4">
          <h5>Notifications</h5>
          <ul className="list-group">
            {notifications.map((n, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {n.message}
                <small className="text-muted">{n.timestamp}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form className="mb-5 border p-4 rounded" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Titre</label>
            <input type="text" name="title" className="form-control" onChange={handleChange} value={newJob.title} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Entreprise</label>
            <input type="text" name="company" className="form-control" onChange={handleChange} value={newJob.company} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Lieu</label>
            <input type="text" name="location" className="form-control" onChange={handleChange} value={newJob.location} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" onChange={handleChange} value={newJob.description} required />
          </div>
          <button type="submit" className="btn btn-primary">Publier</button>
        </form>
      )}

      <div className="input-group mb-4">
        <span className="input-group-text"><Search size={16} /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher une offre"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <p>Aucune offre trouvée.</p>
      ) : (
        <div className="row">
          {filteredJobs.map(job => (
            <div key={job.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                  <p className="card-text flex-grow-1">{job.description}</p>
                  <p className="card-text"><strong>Lieu :</strong> {job.location}</p>

                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <button className="btn btn-primary" onClick={() => handleApply(job)}>
                      Postuler
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(job.id)}>
                      <Trash2 size={16} className="me-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobSearch;
