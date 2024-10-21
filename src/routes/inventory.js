const { Router } = require('express');
const router = Router();
const db = require('../../config/db');
const { validateToken } = require('./auth'); // Importa el middleware


router.use(validateToken);

// Obtener todos los productos del inventario
router.get('/', (req, res) => {
    const query = 'SELECT * FROM inventory'; // Consulta SQL para obtener todos los productos
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving data from database.' });
        }
        res.json(results); // Enviar los productos como respuesta
    });
});

// Obtener un producto específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM inventory WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving product.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json(result[0]); // Enviar el producto como respuesta
    });
});

// Agregar un nuevo producto al inventario
router.post('/', (req, res) => {
    const { name, category, quantity, price } = req.body;
    if (name && category && quantity && price) {
        const query = 'INSERT INTO inventory (name, category, quantity, price) VALUES (?, ?, ?, ?)';
        db.query(query, [name, category, quantity, price], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving product to database.' });
            }
            res.json({ message: 'Product added successfully', productId: result.insertId });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, category, quantity, and price.' });
    }
});

// Actualizar un producto del inventario por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;
    if (name && category && quantity && price) {
        const query = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?';
        db.query(query, [name, category, quantity, price, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating product.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found.' });
            }
            res.json({ message: 'Product updated successfully' });
        });
    } else {
        res.status(400).json({ error: 'Please provide name, category, quantity, and price.' });
    }
});

// Eliminar un producto del inventario por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventory WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting product.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
