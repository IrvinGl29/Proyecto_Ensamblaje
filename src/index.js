const express = require('express');
const app = express();
const morgan = require('morgan');

//settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // Para analizar datos de formularios
app.use(express.json()); // Para analizar datos en formato JSON

//routes (modularizadas)
//app.use('/api/users', require('./routes/users'));
//app.use('/api/components', require('./routes/components'));
//app.use('/api/pc-builds', require('./routes/pc-builds'));
app.use('/api/inventory', require('./routes/inventory')); // Rutas para el inventario
//app.use('/api/support', require('./routes/support'));

//empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
