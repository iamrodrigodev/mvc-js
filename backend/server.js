const express = require('express');
const cors = require('cors');
const libroRoutes = require('./src/routes/libro.route');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/libros', libroRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;