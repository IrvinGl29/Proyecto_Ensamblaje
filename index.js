const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const { router: authRouter, validateToken } = require('./src/routes/auth'); // Importa el router y el middleware

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

// Rutas modularizadas
app.use('/api/components', require('./src/routes/components'));
app.use('/api/pc-builds', require('./src/routes/pc-builds'));

// Aplica el middleware a las rutas de inventario
const inventoryRouter = require('./src/routes/inventory');
app.use('/api/inventory', validateToken, inventoryRouter); // Protege las rutas de inventario

app.use('/api/support', require('./src/routes/support'));

// Empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
