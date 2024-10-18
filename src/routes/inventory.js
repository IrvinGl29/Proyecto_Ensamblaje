const { Router } = require('express');
const { validateToken } = require('./auth'); // Importa el middleware
const router = Router();
const _ = require('underscore');
const fs = require('fs');

let inventory = require('../inventory.json');

// Aplica el middleware para proteger todas las rutas en este router
router.use(validateToken);

// Obtener todos los productos del inventario
router.get('/', (req, res) => {
    res.send(inventory);
});

// Obtener un producto específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = inventory.find(product => product.id == id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found.' });
    }
});

// Agregar un nuevo producto al inventario
router.post('/', (req, res) => {
    const { name, category, quantity, price } = req.body;

    if (name && category && quantity && price) {
        const id = inventory.length + 1; // Asignar un nuevo ID
        const newProduct = { id, name, category, quantity, price };
        inventory.push(newProduct);

        fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'There was an error saving the product.' });
            }
            res.json(inventory);
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
        let productFound = false;
        _.each(inventory, (product) => {
            if (product.id == id) {
                product.name = name;
                product.category = category;
                product.quantity = quantity;
                product.price = price;
                productFound = true;
            }
        });

        if (productFound) {
            fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'There was an error saving the updated product.' });
                }
                res.json(inventory);
            });
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, category, quantity, and price.' });
    }
});

// Eliminar un producto del inventario por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let productFound = false;

    inventory = inventory.filter((product) => {
        if (product.id == id) {
            productFound = true;
            return false;
        }
        return true;
    });

    if (productFound) {
        fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'There was an error deleting the product.' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        });
    } else {
        res.status(404).json({ error: 'Product not found.' });
    }
});

module.exports = router;
