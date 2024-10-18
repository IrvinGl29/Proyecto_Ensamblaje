const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const fs = require('fs');

let supportRequests = require('../support.json'); // Cambia esto por la ruta correcta de tu archivo JSON
console.log(supportRequests);

// Obtener todas las solicitudes de soporte
router.get('/', (req, res) => {
    res.send(supportRequests);
});

// Obtener una solicitud de soporte específica por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const request = supportRequests.find(request => request.id == id);

    if (request) {
        res.json(request);
    } else {
        res.status(404).json({ error: 'Support request not found.' });
    }
});

// Agregar una nueva solicitud de soporte
router.post('/', (req, res) => {
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        const id = supportRequests.length + 1; // Asignar un nuevo ID
        const newRequest = { id, customerName, issueDescription, components, status };
        supportRequests.push(newRequest); // Agregar la nueva solicitud al array

        // Guardar el array actualizado en el archivo support-requests.json
        fs.writeFile('./support-requests.json', JSON.stringify(supportRequests, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error saving the support request.' });
            }
            res.json(supportRequests); // Enviar la respuesta con el array actualizado
        });
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Actualizar una solicitud de soporte por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, issueDescription, components, status } = req.body;

    if (customerName && issueDescription && components && status) {
        let requestFound = false;
        _.each(supportRequests, (request, i) => {
            if (request.id == id) {
                request.customerName = customerName;
                request.issueDescription = issueDescription;
                request.components = components;
                request.status = status;
                requestFound = true;
            }
        });

        if (requestFound) {
            // Guardar el array actualizado en el archivo support-requests.json
            fs.writeFile('./support-requests.json', JSON.stringify(supportRequests, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).json({ error: 'There was an error saving the updated support request.' });
                }
                res.json(supportRequests);
            });
        } else {
            res.status(404).json({ error: 'Support request not found.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide customerName, issueDescription, components, and status.' });
    }
});

// Eliminar una solicitud de soporte por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let requestFound = false; // Bandera para verificar si la solicitud fue encontrada y eliminada

    // Filtrar el array para eliminar la solicitud correspondiente
    supportRequests = supportRequests.filter((request) => {
        if (request.id == id) {
            requestFound = true; // Marca que se encontró la solicitud
            return false; // No incluir esta solicitud en el nuevo array
        }
        return true; // Mantener esta solicitud en el nuevo array
    });

    // Si se encontró y eliminó la solicitud, actualizar el archivo
    if (requestFound) {
        fs.writeFile('./support-requests.json', JSON.stringify(supportRequests, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error deleting the support request.' });
            }
            res.status(200).json({ message: 'Support request deleted successfully' });
        });
    } else {
        // Si no se encontró la solicitud
        res.status(404).json({ error: 'Support request not found.' });
    }
});

module.exports = router;
