const Database = require('better-sqlite3');
const db = new Database(':memory:');

db.prepare(`
    CREATE TABLE IF NOT EXISTS libros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        fecha_publicacion DATE NOT NULL,
        genero VARCHAR(255) NOT NULL
    )`).run();


const insertBook = db.prepare(`
    INSERT INTO libros (titulo, autor, fecha_publicacion, genero)
    VALUES (?, ?, ?, ?)`);

const sampleBooks = [
    ['Cien años de soledad', 'Gabriel García Márquez', '1967-05-30', 'Realismo mágico'],
    ['Don Quijote de la Mancha', 'Miguel de Cervantes', '1605-01-16', 'Novela'],
    ['El Señor de los Anillos', 'J.R.R. Tolkien', '1954-07-29', 'Fantasía'],
    ['1984', 'George Orwell', '1949-06-08', 'Ciencia ficción'],
    ['Rayuela', 'Julio Cortázar', '1963-06-28', 'Novela experimental']
];

sampleBooks.forEach(book => {
    insertBook.run(...book);
});

module.exports = db;