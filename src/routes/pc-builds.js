const { Router } = require('express');
const router = Router();
const db = require('../../config/db'); // Asegúrate de que la ruta a db.js sea correcta
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todas las configuraciones de ensamblaje
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM pc_builds'; // Consulta SQL para obtener todas las configuraciones de ensamblaje
        const [results] = await db.promise().query(query);
        res.json(results); // Enviar las configuraciones como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving data from database.' });
    }
});

// Obtener una configuración específica por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM pc_builds WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'PC Build not found.' });
        }

        res.json(result[0]); // Enviar la configuración como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving PC Build.' });
    }
});

// Agregar una nueva configuración de ensamblaje
router.post('/', async (req, res) => {
    const { name, components, price } = req.body;

    if (name && components && price) {
        try {
            const query = 'INSERT INTO pc_builds (name, components, price) VALUES (?, ?, ?)';
            const [result] = await db.promise().query(query, [name, components, price]);
            res.json({ message: 'PC Build added successfully', pcBuildId: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error saving PC Build to database.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, components, and price.' });
    }
});

// Actualizar una configuración de ensamblaje por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, components, price } = req.body;

    if (name && components && price) {
        try {
            const query = 'UPDATE pc_builds SET name = ?, components = ?, price = ? WHERE id = ?';
            const [result] = await db.promise().query(query, [name, components, price, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'PC Build not found.' });
            }

            res.json({ message: 'PC Build updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error updating PC Build.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, components, and price.' });
    }
});

// Eliminar una configuración de ensamblaje por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM pc_builds WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'PC Build not found.' });
        }

        res.json({ message: 'PC Build deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting PC Build.' });
    }
});

module.exports = router;
