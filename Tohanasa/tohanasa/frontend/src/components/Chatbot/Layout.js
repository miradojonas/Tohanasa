// src/components/Layout.js
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Composant de layout global qui remplace base.html.
 * @param {string} title - Titre de la page (comme {% block title %}).
 * @param {JSX.Element} children - Contenu principal (comme {% block content %}).
 */
const Layout = ({ title = 'React App', children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="layout">
      {children}

      {/* Scripts JS (optionnels) comme dans base.html */}
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </div>
  );
};

export default Layout;
