const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // Importa el paquete cors
require('dotenv').config();
const { router: authRouter, validateToken } = require('./src/routes/auth');
const db = require('./config/db');

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Middlewares
app.use(cors()); // Aplica CORS a todas las rutas
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// Rutas de autenticación
app.use('/api/auth', authRouter);


// Aplica el middleware de validación a todas las rutas
app.use(validateToken);

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
        process.exit(1);
    } else {
        console.log(`Server running on http://localhost:${port}`);
    }
});
