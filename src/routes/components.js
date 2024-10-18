const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

let components = require('../components.json'); // Cambia esto por la ruta correcta de tu archivo JSON
console.log(components);

// Obtener todos los componentes
router.get('/', (req, res) => {
    res.send(components);
});

// Obtener un componente específico por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const component = components.find(component => component.id == id);

    if (component) {
        res.json(component);
    } else {
        res.status(404).json({ error: 'Component not found.' });
    }
});

// Agregar un nuevo componente
router.post('/', (req, res) => {
    const { name, type, manufacturer, price, stock } = req.body;

    if (name && type && manufacturer && price && stock) {
        const id = components.length + 1; // Asignar un nuevo ID
        const newComponent = { id, name, type, manufacturer, price, stock };
        components.push(newComponent); // Agregar el nuevo componente al array

        // Guardar el array actualizado en el archivo components.json
        fs.writeFile('./components.json', JSON.stringify(components, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error saving the component.' });
            }
            res.json(components); // Enviar la respuesta con el array actualizado
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
        let componentFound = false;
        _.each(components, (component, i) => {
            if (component.id == id) {
                component.name = name;
                component.type = type;
                component.manufacturer = manufacturer;
                component.price = price;
                component.stock = stock;
                componentFound = true;
            }
        });

        if (componentFound) {
            // Guardar el array actualizado en el archivo components.json
            fs.writeFile('./components.json', JSON.stringify(components, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).json({ error: 'There was an error saving the updated component.' });
                }
                res.json(components);
            });
        } else {
            res.status(404).json({ error: 'Component not found.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, type, manufacturer, price, and stock.' });
    }
});

// Eliminar un componente por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let componentFound = false; // Bandera para verificar si el componente fue encontrado y eliminado

    // Filtrar el array para eliminar el componente correspondiente
    components = components.filter((component) => {
        if (component.id == id) {
            componentFound = true; // Marca que se encontró el componente
            return false; // No incluir este componente en el nuevo array
        }
        return true; // Mantener este componente en el nuevo array
    });

    // Si se encontró y eliminó el componente, actualizar el archivo
    if (componentFound) {
        fs.writeFile('./components.json', JSON.stringify(components, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error deleting the component.' });
            }
            res.status(200).json({ message: 'Component deleted successfully' });
        });
    } else {
        // Si no se encontró el componente
        res.status(404).json({ error: 'Component not found.' });
    }
});

module.exports = router;
