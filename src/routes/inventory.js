const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

let inventory = require('../inventory.json'); // Cambiar el archivo de ejemplo
console.log(inventory);

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
        inventory.push(newProduct); // Agregar el nuevo producto al array

        // Guardar el array actualizado en el archivo inventory.json
        fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error saving the product.' });
            }
            res.json(inventory); // Enviar la respuesta con el array actualizado
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
        _.each(inventory, (product, i) => {
            if (product.id == id) {
                product.name = name;
                product.category = category;
                product.quantity = quantity;
                product.price = price;
                productFound = true;
            }
        });

        if (productFound) {
            // Guardar el array actualizado en el archivo inventory.json
            fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
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
    let productFound = false; // Bandera para verificar si el producto fue encontrado y eliminado

    // Filtrar el array para eliminar el producto correspondiente
    inventory = inventory.filter((product) => {
        if (product.id == id) {
            productFound = true; // Marca que se encontró el producto
            return false; // No incluir este producto en el nuevo array
        }
        return true; // Mantener este producto en el nuevo array
    });

    // Si se encontró y eliminó el producto, actualizar el archivo
    if (productFound) {
        fs.writeFile('../inventory.json', JSON.stringify(inventory, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error deleting the product.' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        });
    } else {
        // Si no se encontró el producto
        res.status(404).json({ error: 'Product not found.' });
    }
});

module.exports = router;
