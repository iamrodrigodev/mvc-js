const db = require('../config/bd');

class Libro {
    // Obtener todos los libros
    static getAll() {
        try {
            return db.prepare('SELECT * FROM libros').all();
        } catch (error) {
            console.error('Error al obtener los libros:', error);
            throw error;
        }
    }

    // Obtener un libro por ID
    static getById(id) {
        try {
            return db.prepare('SELECT * FROM libros WHERE id = ?').get(id);
        } catch (error) {
            console.error('Error al obtener el libro:', error);
            throw error;
        }
    }

    // Crear un nuevo libro
    static create({ titulo, autor, fecha_publicacion, genero }) {
        try {
            const result = db.prepare(`
                INSERT INTO libros (titulo, autor, fecha_publicacion, genero)
                VALUES (?, ?, ?, ?)
            `).run(titulo, autor, fecha_publicacion, genero);
            
            return { id: result.lastInsertRowid, titulo, autor, fecha_publicacion, genero };
        } catch (error) {
            console.error('Error al crear el libro:', error);
            throw error;
        }
    }

    // Actualizar un libro existente
    static update(id, { titulo, autor, fecha_publicacion, genero }) {
        try {
            const result = db.prepare(`
                UPDATE libros 
                SET titulo = ?, autor = ?, fecha_publicacion = ?, genero = ?
                WHERE id = ?
            `).run(titulo, autor, fecha_publicacion, genero, id);
            
            return result.changes > 0 ? { id, titulo, autor, fecha_publicacion, genero } : null;
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
            throw error;
        }
    }

    // Eliminar un libro
    static delete(id) {
        try {
            return db.prepare('DELETE FROM libros WHERE id = ?').run(id).changes > 0;
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            throw error;
        }
    }

    // Buscar libros por título o autor
    static search(query) {
        try {
            const searchTerm = `%${query}%`;
            return db.prepare(`
                SELECT * FROM libros 
                WHERE titulo LIKE ? OR autor LIKE ?
            `).all(searchTerm, searchTerm);
        } catch (error) {
            console.error('Error al buscar libros:', error);
            throw error;
        }
    }

    // Verificar si un libro existe por su título (exact match)
    static existsByTitulo(titulo) {
        try {
            const result = db.prepare(`
                SELECT COUNT(*) as count FROM libros 
                WHERE titulo = ?
            `).get(titulo);
            
            return result.count > 0;
        } catch (error) {
            console.error('Error al verificar existencia del libro:', error);
            throw error;
        }
    }
}

module.exports = Libro;