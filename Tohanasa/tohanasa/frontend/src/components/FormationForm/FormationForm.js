import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Play, Search, Plus, Trash2, Bell } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:8081/api/formations/formations/';
// Les URLs backend pour notifications restent mais ne seront pas utilisées ici pour les notifications locales
const NOTIFY_URL = 'http://localhost:8081/api/formations/notify/';
const MY_NOTIFICATIONS_URL = 'http://localhost:8081/api/formations/my-notifications/';

function FormationList() {
  const [formations, setFormations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);  // Etat pour afficher/masquer la liste des notif
  const [newFormation, setNewFormation] = useState({
    title: '',
    institution: '',
    start_date: '',
    end_date: '',
    description: '',
    type: 'online',
    document: null,
    video_file: null,
  });

  const userId = parseInt(localStorage.getItem('user_id')) || null;

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setFormations(response.data);
        setFilteredFormations(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des formations', error);
        setLoading(false);
      });

    // On ne charge plus les notifications backend pour le moment
    // axios.get(MY_NOTIFICATIONS_URL)
    //   .then(response => {
    //     setNotifications(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Erreur lors du chargement des notifications', error);
    //   });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredFormations(
      formations.filter(f => f.title.toLowerCase().includes(value))
    );
  };

  // Nouvelle fonction handleParticipate avec notification locale
  const handleParticipate = (formation) => {
    alert(`Vous participez à la formation: ${formation.title}`);

    const newNotif = {
      message: `Quelqu'un a participé à votre formation: ${formation.title}`,
      timestamp: new Date().toLocaleString()
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette formation ?')) return;
    axios.delete(`${API_URL}${id}/`)
      .then(() => {
        const updated = formations.filter(f => f.id !== id);
        setFormations(updated);
        setFilteredFormations(updated);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression', err);
        alert("Vous n'avez pas la permission de supprimer cette formation.");
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewFormation({ ...newFormation, [name]: files[0] });
    } else {
      setNewFormation({ ...newFormation, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in newFormation) {
      if (newFormation[key]) {
        formData.append(key, newFormation[key]);
      }
    }

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Formation ajoutée avec succès !');
      const updated = [...formations, response.data];
      setFormations(updated);
      setFilteredFormations(updated);
      setShowForm(false);
      setNewFormation({
        title: '', institution: '', start_date: '', end_date: '', description: '', type: 'online', document: null, video_file: null
      });
    } catch (err) {
      alert("Erreur lors de l'envoi de la formation.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Formations</h1>
        <div>
          <button
            className="btn btn-outline-dark me-3"
            title="Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="badge bg-danger ms-1">{notifications.length}</span>
            )}
          </button>
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} className="me-1" /> Publier une formation
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
            <input type="text" name="title" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Institution</label>
            <input type="text" name="institution" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Date de début</label>
            <input type="date" name="start_date" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Date de fin</label>
            <input type="date" name="end_date" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select name="type" className="form-select" onChange={handleChange} required>
              <option value="online">En ligne</option>
              <option value="in-person">En personne</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Document</label>
            <input type="file" name="document" className="form-control" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Vidéo</label>
            <input type="file" name="video_file" className="form-control" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Publier</button>
        </form>
      )}

      <div className="input-group mb-4">
        <span className="input-group-text"><Search size={16} /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher une formation"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {filteredFormations.length === 0 ? (
        <p>Aucune formation trouvée.</p>
      ) : (
        <div className="row">
          {filteredFormations.map(formation => (
            <div key={formation.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{formation.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{formation.institution}</h6>
                  <p className="card-text">{formation.description}</p>
                  <p className="card-text">
                    <strong>Du :</strong> {formation.start_date} <strong>au</strong> {formation.end_date}
                  </p>

                  {formation.document && (
                    <a href={formation.document} className="btn btn-outline-secondary me-2" download>
                      <Download size={16} className="me-1" /> Télécharger le document
                    </a>
                  )}

                  {formation.video_file && (
                    <>
                      <video controls className="w-100 mt-2">
                        <source src={formation.video_file} type="video/mp4" />
                        Votre navigateur ne supporte pas la vidéo.
                      </video>
                      <a href={formation.video_file} className="btn btn-outline-secondary mt-2 me-2" download>
                        <Download size={16} className="me-1" /> Télécharger la vidéo
                      </a>
                    </>
                  )}

                  <button className="btn btn-primary mt-3 me-2" onClick={() => handleParticipate(formation)}>
                    <Play size={16} className="me-1" /> Participer / Regarder
                  </button>

                  {userId === formation.user && (
                    <button className="btn btn-danger mt-3" onClick={() => handleDelete(formation.id)}>
                      <Trash2 size={16} className="me-1" /> Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormationList;
