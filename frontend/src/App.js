import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ListaLibros from './pages/ListaLibros';
import DetalleLibro from './pages/DetalleLibro';
import EditarLibro from './pages/EditarLibro';
import CrearLibro from './pages/CrearLibro';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/libros" replace />} />
          <Route path="/libros" element={<ListaLibros />} />
          <Route path="/libros/nuevo" element={<CrearLibro />} />
          <Route path="/libros/:id/editar" element={<EditarLibro />} />
          <Route path="*" element={<Navigate to="/libros" replace />} />
          <Route path="/libros/:id/detalles" element={<DetalleLibro />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;