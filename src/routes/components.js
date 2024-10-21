const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todos los componentes
router.get('/', (req, res) => {
    const query = 'SELECT * FROM components'; // Consulta SQL para obtener todos los componentes
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving data from database.' });
        }
        res.json(results); // Enviar los componentes como respuesta
    });
});

// Obtener un componente específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM components WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving component.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Component not found.' });
        }
        res.json(result[0]); // Enviar el componente como respuesta
    });
});

// Agregar un nuevo componente
router.post('/', (req, res) => {
    const { name, type, manufacturer, price, stock } = req.body;

    if (name && type && manufacturer && price && stock) {
        const query = 'INSERT INTO components (name, type, manufacturer, price, stock) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, type, manufacturer, price, stock], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving component to database.' });
            }
            res.json({ message: 'Component added successfully', componentId: result.insertId });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, type, manufacturer, price, and stock.' });
    }
});

// Actualizar un componente por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, type, manufacturer, price, stock } = req.body;

    if (name && type && manufacturer && price && stock) {
        const query = 'UPDATE components SET name = ?, type = ?, manufacturer = ?, price = ?, stock = ? WHERE id = ?';
        db.query(query, [name, type, manufacturer, price, stock, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating component.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Component not found.' });
            }
            res.json({ message: 'Component updated successfully' });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, type, manufacturer, price, and stock.' });
    }
});

// Eliminar un componente por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM components WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting component.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Component not found.' });
        }
        res.json({ message: 'Component deleted successfully' });
    });
});

module.exports = router;
