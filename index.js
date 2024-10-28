const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const { router: authRouter, validateToken } = require('./src/routes/auth'); // Importa el router y el middleware
const db = require('./config/db');  // Asegúrate de que la ruta sea correcta

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Aplica el middleware de validación a todas las rutas
app.use(validateToken); // Protege todas las rutas a partir de aquí

// Rutas modularizadas
app.use('/api/components', require('./src/routes/components'));
app.use('/api/pc-builds', require('./src/routes/pc-builds'));
app.use('/api/inventory', require('./src/routes/inventory'));
app.use('/api/support', require('./src/routes/support'));

// Empezando el servidor
const port = app.get('port');
app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1); // Termina el proceso si hay un error
    } else {
        console.log(`Server running on http://localhost:${port}`);
    }
});
