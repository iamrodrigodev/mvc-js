import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ListaLibros from './pages/ListaLibros';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/libros" replace />} />
          <Route path="/libros" element={<ListaLibros />} />
          <Route path="*" element={<Navigate to="/libros" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;