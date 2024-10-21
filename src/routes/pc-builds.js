const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todas las configuraciones de ensamblaje
router.get('/', (req, res) => {
    const query = 'SELECT * FROM pc_builds'; // Consulta SQL para obtener todas las configuraciones de ensamblaje
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving data from database.' });
        }
        res.json(results); // Enviar las configuraciones como respuesta
    });
});

// Obtener una configuración específica por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pc_builds WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving PC Build.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'PC Build not found.' });
        }
        res.json(result[0]); // Enviar la configuración como respuesta
    });
});

// Agregar una nueva configuración de ensamblaje
router.post('/', (req, res) => {
    const { name, components, price } = req.body;

    if (name && components && price) {
        const query = 'INSERT INTO pc_builds (name, components, price) VALUES (?, ?, ?)';
        db.query(query, [name, components, price], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving PC Build to database.' });
            }
            res.json({ message: 'PC Build added successfully', pcBuildId: result.insertId });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, components, and price.' });
    }
});

// Actualizar una configuración de ensamblaje por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, components, price } = req.body;

    if (name && components && price) {
        const query = 'UPDATE pc_builds SET name = ?, components = ?, price = ? WHERE id = ?';
        db.query(query, [name, components, price, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating PC Build.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'PC Build not found.' });
            }
            res.json({ message: 'PC Build updated successfully' });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, components, and price.' });
    }
});

// Eliminar una configuración de ensamblaje por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pc_builds WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting PC Build.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'PC Build not found.' });
        }
        res.json({ message: 'PC Build deleted successfully' });
    });
});

module.exports = router;
