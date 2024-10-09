const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes (modularizadas)
app.use('/api/users', require('./routes/users'));
//app.use('/api/components', require('./routes/components'));
//app.use('/api/pc-builds', require('./routes/pc-builds'));
//app.use('/api/inventory', require('./routes/inventory'));
//app.use('/api/support', require('./routes/support'));

//empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
