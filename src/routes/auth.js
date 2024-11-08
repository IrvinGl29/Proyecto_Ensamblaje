const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../config/db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const router = Router();
const saltRounds = 10; // Número de rondas de sal para bcrypt

// Función para generar el token de acceso
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m' });
}

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardar el nuevo usuario en la base de datos
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving user to database.' });
        }
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
});

// Ruta para autenticar y generar un token
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }

    // Buscar el usuario en la base de datos
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving user from database.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = results[0];

        // Comparar las contraseñas
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // Generar el token JWT
        const accessToken = generateAccessToken({ username: user.username });

        // Establecer el token en una cookie HttpOnly y Secure
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Usar Secure solo en producción
            sameSite: 'Strict', // Ajustar SameSite según las necesidades
            maxAge: 5 * 60 * 1000 // 5 minutos en milisegundos, igual a expiresIn del token
        }).json({
            message: 'Usuario autenticado'
        });
    });
});

// Coloca esto en auth.js
router.get('/check', validateToken, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});


// Middleware para verificar JWT
function validateToken(req, res, next) {
    const accessToken = req.cookies.token;

    if (!accessToken) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Access denied, token expired or incorrect' });
        } else {
            req.user = user; // Almacena la información del usuario decodificado
            next();
        }
    });
}


// Exporta el router y el middleware
module.exports = { router, validateToken };
