const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Cambia según sea necesario
    user: 'irvin',      // Tu usuario de MySQL
    password: 'irvin123',  // Tu contraseña de MySQL
    database: 'ensamblaje_pc' // El nombre de la base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = connection;
