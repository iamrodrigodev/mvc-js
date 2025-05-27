import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/ModalEliminar.css';

const ModalEliminar = ({ mostrar, onCerrar, onConfirmar, libro }) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirmar eliminación</h3>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro de que deseas eliminar el libro "{libro?.titulo}"?</p>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={onCerrar}
            type="button"
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger"
            onClick={onConfirmar}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalEliminar.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  onCerrar: PropTypes.func.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  libro: PropTypes.shape({
    id: PropTypes.string,
    titulo: PropTypes.string,
  }),
};

export default ModalEliminar;
