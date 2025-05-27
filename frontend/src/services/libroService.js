import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:4000/api';

export const libroService = {

    // Obtiene todos los libros
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/libros`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los libros:', error);
            throw error;
        }
    },
    
    // Obtiene un libro por su ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/libros/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el libro:', error);
            throw error;
        }
    },
    
    // Crea un nuevo libro
    create: async (libro) => {
        try {
            const response = await axios.post(`${API_URL}/libros`, libro);
            return response.data;
        } catch (error) {
            console.error('Error al crear el libro:', error);
            throw error;
        }
    },
    
    // Actualiza un libro existente
    update: async (id, libro) => {
        try {
            const response = await axios.put(`${API_URL}/libros/${id}`, libro);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
            throw error;
        }
    },
    
    // Elimina un libro existente
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/libros/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            throw error;
        }
    }
};

// Exportar el servicio
export default libroService;