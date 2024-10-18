const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

let pcBuilds = require('../pc-builds.json'); // Cambia esto por la ruta correcta de tu archivo JSON
console.log(pcBuilds);

// Obtener todas las configuraciones de ensamblaje
router.get('/', (req, res) => {
    res.send(pcBuilds);
});

// Obtener una configuración específica por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const pcBuild = pcBuilds.find(build => build.id == id);

    if (pcBuild) {
        res.json(pcBuild);
    } else {
        res.status(404).json({ error: 'PC Build not found.' });
    }
});

// Agregar una nueva configuración de ensamblaje
router.post('/', (req, res) => {
    const { name, components, price } = req.body;

    if (name && components && price) {
        const id = pcBuilds.length + 1; // Asignar un nuevo ID
        const newBuild = { id, name, components, price };
        pcBuilds.push(newBuild); // Agregar la nueva configuración al array

        // Guardar el array actualizado en el archivo pc-builds.json
        fs.writeFile('./pc-builds.json', JSON.stringify(pcBuilds, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error saving the PC Build.' });
            }
            res.json(pcBuilds); // Enviar la respuesta con el array actualizado
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
        let buildFound = false;
        _.each(pcBuilds, (build, i) => {
            if (build.id == id) {
                build.name = name;
                build.components = components;
                build.price = price;
                buildFound = true;
            }
        });

        if (buildFound) {
            // Guardar el array actualizado en el archivo pc-builds.json
            fs.writeFile('./pc-builds.json', JSON.stringify(pcBuilds, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).json({ error: 'There was an error saving the updated PC Build.' });
                }
                res.json(pcBuilds);
            });
        } else {
            res.status(404).json({ error: 'PC Build not found.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide name, components, and price.' });
    }
});

// Eliminar una configuración de ensamblaje por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let buildFound = false; // Bandera para verificar si la configuración fue encontrada y eliminada

    // Filtrar el array para eliminar la configuración correspondiente
    pcBuilds = pcBuilds.filter((build) => {
        if (build.id == id) {
            buildFound = true; // Marca que se encontró la configuración
            return false; // No incluir esta configuración en el nuevo array
        }
        return true; // Mantener esta configuración en el nuevo array
    });

    // Si se encontró y eliminó la configuración, actualizar el archivo
    if (buildFound) {
        fs.writeFile('./pc-builds.json', JSON.stringify(pcBuilds, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error deleting the PC Build.' });
            }
            res.status(200).json({ message: 'PC Build deleted successfully' });
        });
    } else {
        // Si no se encontró la configuración
        res.status(404).json({ error: 'PC Build not found.' });
    }
});

module.exports = router;
