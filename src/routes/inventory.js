const { Router } = require('express');
const router = Router();
const db = require('../../config/db');
const { validateToken } = require('./auth'); // Importa el middleware

router.use(validateToken);

// Obtener todos los productos del inventario
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM inventory';
        const [results] = await db.promise().query(query);
        res.json(results); // Enviar los productos como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving data from database.' });
    }
});

// Obtener un producto específico por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM inventory WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json(result[0]); // Enviar el producto como respuesta
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving product.' });
    }
});

// Agregar un nuevo producto al inventario
router.post('/', async (req, res) => {
    const { name, category, quantity, price } = req.body;

    if (name && category && quantity && price) {
        try {
            const query = 'INSERT INTO inventory (name, category, quantity, price) VALUES (?, ?, ?, ?)';
            const [result] = await db.promise().query(query, [name, category, quantity, price]);
            res.json({ message: 'Product added successfully', productId: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error saving product to database.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, category, quantity, and price.' });
    }
});

// Actualizar un producto del inventario por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    if (name && category && quantity && price) {
        try {
            const query = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?';
            const [result] = await db.promise().query(query, [name, category, quantity, price, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found.' });
            }

            res.json({ message: 'Product updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error updating product.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, category, quantity, and price.' });
    }
});

// Eliminar un producto del inventario por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM inventory WHERE id = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting product.' });
    }
});

module.exports = router;
