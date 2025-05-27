import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { libroService } from '../services/libroService';
import '../styles/pages/EditarLibro.css';

const EditarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const cargarLibro = async () => {
      try {
        const response = await libroService.getById(id);
        if (response && response.success) {
          setFormData(response.data);
        } else {
          setError('No se pudo cargar la información del libro');
        }
      } catch (err) {
        console.error('Error al cargar el libro:', err);
        setError('Error al cargar el libro');
      } finally {
        setLoading(false);
      }
    };

    cargarLibro();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar el mensaje de error del campo que se está modificando
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpiar mensajes generales cuando el usuario empiece a escribir
    if (showError) {
      setShowError(false);
      setError(null);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
      isValid = false;
    }

    if (!formData.autor.trim()) {
      newErrors.autor = 'El autor es requerido';
      isValid = false;
    }

    if (!formData.fecha_publicacion) {
      newErrors.fecha_publicacion = 'La fecha de publicación es requerida';
      isValid = false;
    }

    if (!formData.genero.trim()) {
      newErrors.genero = 'El género es requerido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    e.stopPropagation();
    
    // Evitar envíos múltiples
    if (submitting) {
      return;
    }
    
    setSubmitting(true);
    
    // Limpiar estados anteriores
    setError(null);
    setErrors({});
    setShowError(false);
    
    // Validar el formulario
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      console.log('Enviando datos:', formData);
      const response = await libroService.update(id, formData);
      
      console.log('Respuesta del servidor:', response);
      
      if (response && response.success) {
        setError(null);
        setShowError(false);
        
        // Guardar el mensaje de éxito en sessionStorage
        console.log('Guardando mensaje en sessionStorage...');
        sessionStorage.setItem('showSuccessToast', '¡Libro actualizado correctamente!');
        console.log('Mensaje guardado, redirigiendo...');
        
        // Redirigir a la página de listado de libros
        navigate('/libros');
        
      } else {
        throw new Error(response?.message || 'No se pudo actualizar el libro');
      }
    } catch (err) {
      console.error('Error al actualizar el libro:', err);
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
        // Si es un mensaje de error general
        else if (errorData.message) {
          setError(errorData.message);
          setShowError(true);
        } 
        // Si el error viene en otro formato
        else {
          setError('Error del servidor: ' + JSON.stringify(errorData));
          setShowError(true);
        }
      } else {
        // Error de red o sin respuesta del servidor
        const errorMsg = err.message || 'Error de conexión al actualizar el libro';
        setError(errorMsg);
        setShowError(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error && !showError) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="editar-libro">
      <div className="editar-card">
        <div className="editar-header">
          <h2>Editar Libro</h2>
        </div>
        
        <div className="editar-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
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
              <label htmlFor="autor" className="form-label">Autor</label>
              <input
                type="text"
                className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                required
              />
              {errors.autor && (
                <div className="invalid-feedback">
                  {Array.isArray(errors.autor) ? errors.autor[0] : errors.autor}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_publicacion" className="form-label">Fecha de Publicación</label>
              <input
                type="date"
                className={`form-control ${errors.fecha_publicacion ? 'is-invalid' : ''}`}
                id="fecha_publicacion"
                name="fecha_publicacion"
                value={formData.fecha_publicacion}
                onChange={handleChange}
                required
              />
              {errors.fecha_publicacion && (
                <div className="invalid-feedback">
                  {Array.isArray(errors.fecha_publicacion) ? errors.fecha_publicacion[0] : errors.fecha_publicacion}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="genero" className="form-label">Género</label>
              <input
                type="text"
                className={`form-control ${errors.genero ? 'is-invalid' : ''}`}
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
              />
              {errors.genero && (
                <div className="invalid-feedback">
                  {Array.isArray(errors.genero) ? errors.genero[0] : errors.genero}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/libros')}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-warning text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Libro'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarLibro;