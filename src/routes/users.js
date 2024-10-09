const {Router} = require(`express`);
const router = Router();
const _ = require(`underscore`);

const users = require(`../sample.json`);
console.log(users);

router.get('/', (req, res) => {
    res.send(users);
});

router.post('/', (req, res) => {
    const { name, last_name, user } = req.body;

    if (name && last_name && user) {
        const id = users.length + 1;
        const newUser = { id, name, last_name, user };
        console.log(newUser);
        users.push(newUser);  // Cambié movies por users
        res.json(users);
    } else {
        res.status(500).json({ error: 'There was an error.' });
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

router.delete(`/:id`, (req, res) =>{
    const {id} =req.params;
    _.each(users, (U, i)=>{
        if(U.id == id){
            users.splice(i, 1);
        }
    });
    res.send(`deleted`);
    res.status(200).json({ message: 'User deleted successfully' });

});

module.exports = router;
