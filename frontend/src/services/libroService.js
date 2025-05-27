import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const libroService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/libros`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los libros:', error);
            throw error;
        }
    },
    
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/libros/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el libro:', error);
            throw error;
        }
    },
    
    create: async (libro) => {
        try {
            const response = await axios.post(`${API_URL}/libros`, libro);
            return response.data;
        } catch (error) {
            console.error('Error al crear el libro:', error);
            throw error;
        }
    },
    
    update: async (id, libro) => {
        try {
            const response = await axios.put(`${API_URL}/libros/${id}`, libro);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
            throw error;
        }
    },
    
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

export default libroService;
