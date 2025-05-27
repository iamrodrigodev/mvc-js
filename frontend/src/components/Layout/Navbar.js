import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Layout/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/libros" className="navbar-brand">
          Gestor de Libros
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
