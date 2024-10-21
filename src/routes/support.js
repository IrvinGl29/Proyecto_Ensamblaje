const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todas las solicitudes de soporte
router.get('/', (req, res) => {
    const query = 'SELECT * FROM support'; // Consulta SQL para obtener todas las solicitudes
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving data from database.' });
        }
        res.json(results); // Enviar las solicitudes como respuesta
    });
});

// Obtener una solicitud de soporte específica por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM support WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving support request.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Support request not found.' });
        }
        res.json(result[0]); // Enviar la solicitud como respuesta
    });
});

// Agregar una nueva solicitud de soporte
router.post('/', (req, res) => {
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        const query = 'INSERT INTO support (customerName, issueDescription, components, status) VALUES (?, ?, ?, ?)';
        db.query(query, [customerName, issueDescription, components, status], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving support request to database.' });
            }
            res.json({ message: 'Support request added successfully', requestId: result.insertId });
        });
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Actualizar una solicitud de soporte por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        const query = 'UPDATE support SET customerName = ?, issueDescription = ?, components = ?, status = ? WHERE id = ?';
        db.query(query, [customerName, issueDescription, components, status, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating support request.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Support request not found.' });
            }
            res.json({ message: 'Support request updated successfully' });
        });
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Eliminar una solicitud de soporte por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM support WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting support request.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Support request not found.' });
        }
        res.json({ message: 'Support request deleted successfully' });
    });
});

module.exports = router;
