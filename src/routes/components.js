const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todos los componentes
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM components'; // Consulta SQL para obtener todos los componentes
        const [results] = await db.promise().query(query);
        res.json(results); // Enviar los componentes como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving data from database.' });
    }
});

// Obtener un componente específico por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM components WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Component not found.' });
        }

        res.json(result[0]); // Enviar el componente como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving component.' });
    }
});

// Agregar un nuevo componente
router.post('/', async (req, res) => {
    const { name, type, manufacturer, price, stock } = req.body;

    if (name && type && manufacturer && price && stock) {
        try {
            const query = 'INSERT INTO components (name, type, manufacturer, price, stock) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.promise().query(query, [name, type, manufacturer, price, stock]);
            res.json({ message: 'Component added successfully', componentId: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error saving component to database.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, type, manufacturer, price, and stock.' });
    }
});

// Actualizar un componente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, manufacturer, price, stock } = req.body;

    if (name && type && manufacturer && price && stock) {
        try {
            const query = 'UPDATE components SET name = ?, type = ?, manufacturer = ?, price = ?, stock = ? WHERE id = ?';
            const [result] = await db.promise().query(query, [name, type, manufacturer, price, stock, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Component not found.' });
            }

            res.json({ message: 'Component updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error updating component.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, type, manufacturer, price, and stock.' });
    }
});

// Eliminar un componente por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM components WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Component not found.' });
        }

        res.json({ message: 'Component deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting component.' });
    }
});

module.exports = router;
