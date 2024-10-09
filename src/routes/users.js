const {Router} = require(`express`);
const router = Router();
const _ = require(`underscore`);
const fs = require('fs');

const users = require(`../sample.json`);
console.log(users);

router.get('/', (req, res) => {
    res.send(users);
});

router.post('/', (req, res) => {
    const { name, last_name, user } = req.body;

    if (name && last_name && user) {
        const id = users.length + 1; // Asignar un nuevo ID
        const newUser = { id, name, last_name, user };
        users.push(newUser); // Agregar el nuevo usuario al array

        // Guardar el array actualizado en el archivo sample.json
        fs.writeFile('../sample.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error saving the user.' });
            }
            res.json(users); // Enviar la respuesta con el array actualizado
        });
    } else {
        res.status(400).json({ error: 'Please provide name, last_name, and user.' });
    }
});



router.put('/:id', (req, res)=>{
    const {id}= req.params;
    const {name, last_name, user} = req.body;
    if (name  && last_name && user){
        _.each(users, (U, i) => {
            if (U.id == id) {
                U.name = name;
                U.last_name = last_name;
                U.user = user;
            }
        });
        res.json(users);
    }else {
        res.status(500).json({error: `There was an error.`});
    }
});

router.delete(`/:id`, (req, res) => {
    const { id } = req.params;
    let userFound = false; // Bandera para verificar si el usuario fue encontrado y eliminado

    // Filtrar el array para eliminar el usuario correspondiente
    users = users.filter((U) => {
        if (U.id == id) {
            userFound = true; // Marca que se encontró el usuario
            return false; // No incluir este usuario en el nuevo array
        }
        return true; // Mantener este usuario en el nuevo array
    });

    // Si se encontró y eliminó el usuario, actualizar el archivo
    if (userFound) {
        fs.writeFile('../sample.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ error: 'There was an error deleting the user.' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        });
    } else {
        // Si no se encontró el usuario
        res.status(404).json({ error: 'User not found.' });
    }
});


module.exports = router;
