# Sistema de Gestión de Libros

Aplicación web para la gestión de libros desarrollada con Node.js (Backend) y React (Frontend).

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior) o yarn
- Navegador web moderno

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/mvc-js.git
cd mvc-js
```

### 2. Configurar el Backend

1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

### 3. Configurar el Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd ../frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

## Ejecución

### Iniciar el Backend

```bash
# Desde la carpeta backend
nodemon server.js
```

El servidor backend estará disponible en: http://localhost:4000

### Iniciar el Frontend

```bash
# Desde la carpeta frontend
npm start
```

La aplicación frontend se abrirá automáticamente en tu navegador predeterminado en: http://localhost:3000

## Estructura del Proyecto

```
mvc-js/
├── backend/               # Código del servidor
│   ├── src/
│   │   ├── config/      # Configuraciones
│   │   ├── controllers/   # Controladores
│   │   ├── models/       # Modelos
│   │   └── routes/       # Rutas
│   └── package.json
│
└── frontend/             # Aplicación React
    ├── public/
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── pages/         # Páginas de la aplicación
    │   ├── services/      # Servicios API
    │   └── styles/        # Estilos CSS
    └── package.json
```

## Comandos Útiles

### Backend

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter

### Frontend

- `npm start`: Inicia la aplicación en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run build`: Crea la versión de producción

## Solución de Problemas

Si encuentras algún problema al instalar las dependencias:

1. Asegúrate de tener Node.js y npm instalados correctamente:
   ```bash
   node -v
   npm -v
   ```

2. Si hay problemas con las dependencias, intenta:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   ```

## Soporte

Para soporte, por favor abre un issue en el repositorio.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).