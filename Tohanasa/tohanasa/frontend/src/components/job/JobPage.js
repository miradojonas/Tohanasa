// src/components/job/JobPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function JobPage({ token }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/jobs/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setJob(res.data))
    .catch((err) => {
      setError("Erreur lors du chargement de l'offre.");
      console.error(err);
    });
  }, [id, token]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!job) return <p>Chargement...</p>;

  return (
    <div className="container mt-4">
      <h2>{job.title}</h2>
      <p><strong>Entreprise :</strong> {job.company}</p>
      <p><strong>Lieu :</strong> {job.location}</p>
      <p><strong>Type :</strong> {job.jobType}</p>
      <p><strong>Description :</strong></p>
      <p>{job.description}</p>
    </div>
  );
}

export default JobPage;
