import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { libroService } from '../services/libroService';
import ModalEliminar from '../components/ModalEliminar';
import '../styles/pages/ListaLibros.css';
import '../styles/pages/EditarLibro.css'; // Importamos los estilos del toast

const ListaLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Efecto para mostrar el toast de éxito si viene de una actualización
  useEffect(() => {
    const checkForToast = () => {
      const successMessage = sessionStorage.getItem('showSuccessToast');
      
      if (successMessage) {
        setToastMessage(successMessage);
        setShowToast(true);
        
        // Limpiar el mensaje después de mostrarlo
        sessionStorage.removeItem('showSuccessToast');
        
        // Ocultar el toast después de 3 segundos
        const timer = setTimeout(() => {
          setShowToast(false);
          setToastMessage('');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };
    
    // Pequeño retraso para asegurar que el componente esté completamente montado
    const timer = setTimeout(checkForToast, 100);
    
    return () => {
      clearTimeout(timer);
      setShowToast(false);
      setToastMessage('');
    };
  }, []);
  
  // Efecto para cargar los libros
  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const response = await libroService.getAll();
        // Convertir el diccionario a un array para mostrarlo en la tabla
        if (response && response.data) {
          const librosArray = Object.keys(response.data).map(key => ({
            id: key,
            ...response.data[key]
          }));
          setLibros(librosArray);
        } else {
          setLibros([]);
        }
      } catch (error) {
        console.error('Error al cargar los libros:', error);
        setLibros([]);
      } finally {
        setLoading(false);
      }
    };

    cargarLibros();
  }, []);

  const handleVer = (id) => {
    navigate(`/libros/${id}/detalles`);
  };

  const handleEditar = (id) => {
    navigate(`/libros/${id}/editar`);
  };

  const handleEliminarClick = (libro) => {
    setLibroAEliminar(libro);
    setShowModal(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!libroAEliminar) return;
    
    try {
      await libroService.delete(libroAEliminar.id);
      setLibros(libros.filter(libro => libro.id !== libroAEliminar.id));
      setShowModal(false);
      setLibroAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setLibroAEliminar(null);
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
      {/* Toast de éxito */}
      {showToast && (
        <div className="toast-container">
          <div className="toast show toast-success">
            <div className="toast-message">{toastMessage}</div>
          </div>
        </div>
      )}
      <div className="libros-header">
        <h1>Lista de Libros</h1>
        <button 
          className="btn btn-success"
          onClick={() => navigate('/libros/nuevo')}
          type="button"
        >
          Agregar Libro
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="libros-table" aria-label="Lista de libros">
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Autor</th>
              <th scope="col">Género</th>
              <th scope="col">Fecha de Publicación</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.length > 0 ? (
              libros.map((libro) => (
                <tr key={libro.id}>
                  <td data-label="Título">{libro.titulo || '-'}</td>
                  <td data-label="Autor">{libro.autor || '-'}</td>
                  <td data-label="Género">{libro.genero || '-'}</td>
                  <td data-label="Fecha de Publicación">
                    {libro.fecha_publicacion ? new Date(libro.fecha_publicacion).toLocaleDateString() : '-'}
                  </td>
                  <td className="actions" data-label="Acciones">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleVer(libro.id)}
                        aria-label={`Ver detalles de ${libro.titulo}`}
                        type="button"
                      >
                        Ver
                      </button>
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEditar(libro.id)}
                        aria-label={`Editar ${libro.titulo}`}
                        type="button"
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminarClick(libro)}
                        aria-label={`Eliminar ${libro.titulo}`}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="no-data">No hay libros registrados</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalEliminar 
        mostrar={showModal}
        libro={libroAEliminar}
        onCerrar={handleCerrarModal}
        onConfirmar={handleConfirmarEliminar}
      />
    </div>
  );
};

export default ListaLibros;
