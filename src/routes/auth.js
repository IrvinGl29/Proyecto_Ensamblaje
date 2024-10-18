const { Router } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = Router();

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m' });
}

// Ruta para autenticar y generar un token
router.post('/auth', (req, res) => {
    const { username, password } = req.body;

    // Simulación de validación de usuario
    if (username === 'irvin' && password === '1234') {
        const user = { username: username };

        // Genera el token JWT
        const accessToken = generateAccessToken(user);

        // Respuesta con el token
        res.header('authorization', accessToken).json({
            message: 'Usuario autenticado',
            token: accessToken
        });
    } else {
        res.status(403).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

// Middleware para verificar JWT
function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'];

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

