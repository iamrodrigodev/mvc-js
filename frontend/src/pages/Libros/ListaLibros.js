import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { libroService } from '../../services/libroService';
import './ListaLibros.css';

const ListaLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const data = await libroService.getAll();
        setLibros(data);
      } catch (error) {
        console.error('Error al cargar los libros:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarLibros();
  }, []);

  const handleVer = (id) => {
    navigate(`/libros/ver/${id}`);
  };

  const handleEditar = (id) => {
    navigate(`/libros/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      try {
        await libroService.delete(id);
        setLibros(libros.filter(libro => libro.id !== id));
      } catch (error) {
        console.error('Error al eliminar el libro:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="libros-container">
      <div className="libros-header">
        <h1>Lista de Libros</h1>
        <button 
          className="btn btn-success"
          onClick={() => navigate('/libros/nuevo')}
        >
          Agregar Libro
        </button>
      </div>
      
      <div className="table-container">
        <table className="libros-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Género</th>
              <th>Fecha de Publicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.length > 0 ? (
              libros.map((libro) => (
                <tr key={libro.id}>
                  <td>{libro.titulo}</td>
                  <td>{libro.autor}</td>
                  <td>{libro.genero}</td>
                  <td>{new Date(libro.fecha_publicacion).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-view"
                      onClick={() => handleVer(libro.id)}
                      title="Ver"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEditar(libro.id)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleEliminar(libro.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No hay libros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaLibros;
