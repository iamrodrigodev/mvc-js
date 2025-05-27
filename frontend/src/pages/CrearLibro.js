import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { libroService } from '../services/libroService';
import '../styles/pages/CrearLibro.css';

const CrearLibro = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    fecha_publicacion: '',
    genero: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar el error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (!formData.autor.trim()) {
      newErrors.autor = 'El autor es obligatorio';
    }
    
    if (!formData.fecha_publicacion) {
      newErrors.fecha_publicacion = 'La fecha de publicación es obligatoria';
    } else {
      const fecha = new Date(formData.fecha_publicacion);
      const hoy = new Date();
      
      if (fecha > hoy) {
        newErrors.fecha_publicacion = 'La fecha no puede ser futura';
      }
    }
    
    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await libroService.create(formData);
      
      if (response && response.success) {
        setError(null);
        setShowError(false);
        
        // Guardar el mensaje de éxito en sessionStorage
        sessionStorage.setItem('showSuccessToast', '¡Libro creado correctamente!');
        
        // Redirigir a la página de listado de libros
        navigate('/libros');
      } else {
        throw new Error(response?.message || 'No se pudo crear el libro');
      }
    } catch (err) {
      console.error('Error al crear el libro:', err);
      console.log('Detalles del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Manejar errores de validación del backend
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Si el error tiene campos específicos de validación (Laravel style)
        if (errorData.errors && typeof errorData.errors === 'object') {
          const backendErrors = {};
          Object.keys(errorData.errors).forEach(field => {
            const fieldErrors = errorData.errors[field];
            backendErrors[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
          });
          setErrors(backendErrors);
        }
        // Si el error tiene un campo específico
        else if (errorData.field && errorData.message) {
          setErrors(prev => ({
            ...prev,
            [errorData.field]: errorData.message
          }));
        }
        // Si el error tiene un mensaje general
        else if (errorData.message) {
          // Si el mensaje de error contiene información sobre el título duplicado
          if (errorData.message.includes('título')) {
            setErrors(prev => ({
              ...prev,
              titulo: errorData.message
            }));
          } else {
            setError(errorData.message);
          }
        } else {
          setError('Error al procesar la solicitud');
        }
      } else {
        setError(err.message || 'Error al crear el libro');
      }
      
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crear-libro">
      <div className="crear-card">
        <div className="crear-header">
          <h2>Crear Nuevo Libro</h2>
        </div>
        
        <div className="crear-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">
                Título <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.titulo && (
                <div className="invalid-feedback">
                  {errors.titulo}
                </div>
              )}
              
              {showError && error && (
                <div className="invalid-feedback" style={{
                  display: 'block',
                  fontSize: '0.875em',
                  marginTop: '0.25rem',
                  color: '#dc3545'
                }}>
                  {error}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="autor" className="form-label">
                Autor <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.autor && <div className="invalid-feedback">{errors.autor}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="fecha_publicacion" className="form-label">
                Fecha de Publicación <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.fecha_publicacion ? 'is-invalid' : ''}`}
                id="fecha_publicacion"
                name="fecha_publicacion"
                value={formData.fecha_publicacion}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.fecha_publicacion && (
                <div className="invalid-feedback">{errors.fecha_publicacion}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="genero" className="form-label">
                Género <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.genero ? 'is-invalid' : ''}`}
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Ej: Novela, Ciencia Ficción, etc."
              />
              {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate('/libros')}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : 'Guardar Libro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearLibro;
