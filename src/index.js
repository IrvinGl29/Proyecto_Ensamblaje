const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//settings
app.set(`port`, process.env.PORT || 3000);
app.set(`json spaces`, 2);

//middlewares
app.use(morgan(`dev`));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
//app.use(require(`./routes/index`));
//app.use(`/api/movies`, require(`./routes/movies`));
//app.use(`/api/users`, require(`./routes/users`));
app.get('/components', (req, res) => {
    res.send('Obtener todos los componentes');
});

app.post('/components', (req, res) => {
    res.send('Añadir un nuevo componente');
});

app.get('/components/:id', (req, res) => {
    res.send(`Obtener componente con ID ${req.params.id}`);
});

app.put('/components/:id', (req, res) => {
    res.send(`Actualizar componente con ID ${req.params.id}`);
});

app.delete('/components/:id', (req, res) => {
    res.send(`Eliminar componente con ID ${req.params.id}`);
});

app.post('/pc-builds', (req, res) => {
    res.send('Crear nueva configuración de PC');
});

app.get('/pc-builds', (req, res) => {
    res.send('Obtener todas las configuraciones de PC');
});

app.get('/pc-builds/:id', (req, res) => {
    res.send(`Obtener configuración de PC con ID ${req.params.id}`);
});

app.put('/pc-builds/:id', (req, res) => {
    res.send(`Actualizar configuración de PC con ID ${req.params.id}`);
});

app.delete('/pc-builds/:id', (req, res) => {
    res.send(`Eliminar configuración de PC con ID ${req.params.id}`);
});

app.post('/pc-builds/:id/validate', (req, res) => {
    res.send(`Validar la configuración de PC con ID ${req.params.id}`);
});

app.post('/users', (req, res) => {
    res.send('Crear un nuevo usuario');
});

app.get('/users/:id', (req, res) => {
    res.send(`Obtener usuario con ID ${req.params.id}`);
});

app.put('/users/:id', (req, res) => {
    res.send(`Actualizar usuario con ID ${req.params.id}`);
});

app.delete('/users/:id', (req, res) => {
    res.send(`Eliminar usuario con ID ${req.params.id}`);
});

app.post('/payments', (req, res) => {
    res.send('Procesar un nuevo pago');
});

app.get('/payments/:id', (req, res) => {
    res.send(`Obtener detalles del pago con ID ${req.params.id}`);
});

app.post('/payments/validate', (req, res) => {
    res.send('Validar un pago antes de procesarlo');
});

app.get('/inventory', (req, res) => {
    res.send('Obtener inventario completo');
});

app.post('/inventory/:componentId', (req, res) => {
    res.send(`Añadir componente con ID ${req.params.componentId} al inventario`);
});

app.put('/inventory/:componentId', (req, res) => {
    res.send(`Actualizar cantidad del componente con ID ${req.params.componentId}`);
});

app.delete('/inventory/:componentId', (req, res) => {
    res.send(`Eliminar componente con ID ${req.params.componentId} del inventario`);
});

app.post('/support', (req, res) => {
    res.send('Crear un nuevo ticket de soporte');
});

app.get('/support/:id', (req, res) => {
    res.send(`Obtener detalles del ticket de soporte con ID ${req.params.id}`);
});

app.put('/support/:id', (req, res) => {
    res.send(`Actualizar ticket de soporte con ID ${req.params.id}`);
});

app.delete('/support/:id', (req, res) => {
    res.send(`Cerrar ticket de soporte con ID ${req.params.id}`);
});


//empezando el servidor
app.listen(app.get(`port`), () => {
    console.log(`Server on port ${app.get(`port`)}`);
});

