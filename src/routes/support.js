const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todas las solicitudes de soporte
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM support'; // Consulta SQL para obtener todas las solicitudes
        const [results] = await db.promise().query(query);
        res.json(results); // Enviar las solicitudes como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving data from database.' });
    }
});

// Obtener una solicitud de soporte específica por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM support WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Support request not found.' });
        }

        res.json(result[0]); // Enviar la solicitud como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving support request.' });
    }
});

// Agregar una nueva solicitud de soporte
router.post('/', async (req, res) => {
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        try {
            const query = 'INSERT INTO support (customerName, issueDescription, components, status) VALUES (?, ?, ?, ?)';
            const [result] = await db.promise().query(query, [customerName, issueDescription, components, status]);
            res.json({ message: 'Support request added successfully', requestId: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error saving support request to database.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Actualizar una solicitud de soporte por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        try {
            const query = 'UPDATE support SET customerName = ?, issueDescription = ?, components = ?, status = ? WHERE id = ?';
            const [result] = await db.promise().query(query, [customerName, issueDescription, components, status, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Support request not found.' });
            }

            res.json({ message: 'Support request updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error updating support request.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Eliminar una solicitud de soporte por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM support WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Support request not found.' });
        }

        res.json({ message: 'Support request deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting support request.' });
    }
});

module.exports = router;
