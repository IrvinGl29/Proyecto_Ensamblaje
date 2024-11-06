const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { router: authRouter, validateToken } = require('./src/routes/auth');
const db = require('./config/db');
const path = require('path');

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el formulario de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Ruta para el Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'));
});

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Middleware de validación de token para rutas protegidas
// Aplica solo después de las rutas públicas
app.use(validateToken);

// Rutas protegidas
app.use('/api/components', require('./src/routes/components'));
app.use('/api/pc-builds', require('./src/routes/pc-builds'));
app.use('/api/inventory', require('./src/routes/inventory'));
app.use('/api/support', require('./src/routes/support'));

// Empezando el servidor
const port = app.get('port');
app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1);
    } else {
        console.log(`Server running on http://localhost:${port}`);
    }
});
