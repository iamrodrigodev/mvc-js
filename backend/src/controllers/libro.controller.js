const Libro = require('../models/Libro');

// Obtener todos los libros
const getAllLibros = (_req, res) => {
    try {
        const libros = Libro.getAll();
        res.status(200).json({
            success: true,
            data: libros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los libros',
            error: error.message
        });
    }
};

// Obtener un libro por ID
const getLibroById = (req, res) => {
    try {
        const { id } = req.params;
        const libro = Libro.getById(id);
        
        if (!libro) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el libro con ese ID`
            });
        }

        res.status(200).json({
            success: true,
            data: libro
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el libro',
            error: error.message
        });
    }
};

// Crear un nuevo libro
const createLibro = (req, res) => {
    try {
        const { titulo, autor, fecha_publicacion, genero } = req.body;

        // Validación básica
        if (!titulo || !autor || !fecha_publicacion || !genero) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si ya existe un libro con el mismo título
        if (Libro.existsByTitulo(titulo)) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un libro con este título',
                field: 'titulo'
            });
        }

        // Validar que la fecha no sea futura
        const fechaPublicacion = new Date(fecha_publicacion);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Establecer a inicio del día actual
        
        if (fechaPublicacion > hoy) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de publicación no puede ser futura'
            });
        }
    
        const nuevoLibro = Libro.create({
            titulo,
            autor,
            fecha_publicacion,
            genero
        });

        res.status(201).json({
            success: true,
            message: 'Libro creado exitosamente',
            data: nuevoLibro
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un libro con este título'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al crear el libro',
            error: error.message
        });
    }
};

// Actualizar un libro existente
const updateLibro = (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor, fecha_publicacion, genero } = req.body;

        // Verificar si el libro existe
        const libroExistente = Libro.getById(id);
        if (!libroExistente) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el libro con ese ID`
            });
        }

        // Si se está actualizando el título, verificar si ya existe otro libro con ese título
        if (titulo && titulo !== libroExistente.titulo) {
            if (Libro.existsByTitulo(titulo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe otro libro con este título'
                });
            }
        }

        // Validar que la fecha no sea futura si se está actualizando
        if (fecha_publicacion) {
            const fechaPublicacion = new Date(fecha_publicacion);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Establecer a inicio del día actual
            
            if (fechaPublicacion > hoy) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de publicación no puede ser futura'
                });
            }
        }

        const datosActualizados = {
            titulo: titulo || libroExistente.titulo,
            autor: autor || libroExistente.autor,
            fecha_publicacion: fecha_publicacion || libroExistente.fecha_publicacion,
            genero: genero || libroExistente.genero
        };

        const libroActualizado = Libro.update(id, datosActualizados);

        if (!libroActualizado) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el libro'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Libro actualizado exitosamente',
            data: libroActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el libro',
            error: error.message
        });
    }
};

// Eliminar un libro
const deleteLibro = (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el libro existe
        const libroExistente = Libro.getById(id);
        if (!libroExistente) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el libro con ese ID`
            });
        }


        const eliminado = Libro.delete(id);
        if (!eliminado) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el libro'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Libro eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el libro',
            error: error.message
        });
    }
};

// Exportar las funciones
module.exports = {
    getAllLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro
};