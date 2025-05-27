import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { libroService } from '../services/libroService';
import '../styles/pages/DetalleLibro.css';

const DetalleLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarLibro = async () => {
      try {
        const response = await libroService.getById(id);
        if (response && response.success) {
          setLibro(response.data);
        } else {
          setError('No se pudo cargar la información del libro');
        }
      } catch (err) {
        console.error('Error al cargar el libro:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    cargarLibro();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/libros')}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!libro) {
    return (
      <div className="container mt-5">
        <h2>Libro no encontrado</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/libros')}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="detalle-libro">
      <div className="detalle-card">
        <div className="detalle-header">
          <h2>{libro.titulo}</h2>
          <p className="mb-0">por {libro.autor || 'Autor desconocido'}</p>
        </div>
        
        <div className="detalle-body">
          <div className="row g-4">
            {/* Columna de detalles */}
            <div className="col-md-8">
              <div className="detalle-seccion">
                <h5>
                  <i className="bi bi-info-circle"></i>
                  Información del Libro
                </h5>
                <div className="detalle-info">
                  <div className="detalle-item">
                    <strong>Título</strong>
                    <p>{libro.titulo}</p>
                  </div>
                  
                  <div className="detalle-item">
                    <strong>Autor</strong>
                    <p>{libro.autor || 'No especificado'}</p>
                  </div>
                  
                  <div className="detalle-item">
                    <strong>Género</strong>
                    <p>{libro.genero || 'No especificado'}</p>
                  </div>
                  
                  <div className="detalle-item">
                    <strong>Publicación</strong>
                    <p>
                      {libro.fecha_publicacion 
                        ? new Date(libro.fecha_publicacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No especificada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="detalle-footer">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/libros')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleLibro;
