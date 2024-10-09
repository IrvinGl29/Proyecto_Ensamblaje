const {Router} = require(`express`);
const router = Router();
const _ = require(`underscore`);

const movies = require(`../sample.json`);
console.log(movies);

router.get('/', (req, res) => {
    res.send(movies);
});

router.post('/',(req, res) =>{
    const {title, director, raiting} = req.body;

    if (title && director && raiting){
        const id = movies.length + 1;
        const newMovie = {id, ...req.body};
        console.log(newMovie);
        movies.push(newMovie);
        res.json(movies);
    } else {
        res.status(500).json({error: `There was an error.`});
        }

});

router.put('/:id', (req, res)=>{
    const {id}= req.params;
    const {title, director, raiting} = req.body;
    if (title  && director && raiting){
        _.each(movies, (movie, i) => {
            if (movie.id == id) {
                movie.title = title;
                movie.director = director;
                movie.raiting = raiting;
            }
        });
        res.json(movies);
    }else {
        res.status(500).json({error: `There was an error.`});
    }
});

router.delete(`/:id`, (req, res) =>{
    const {id} =req.params;
    _.each(movies, (movie, i)=>{
        if(movie.id == id){
            movies.splice(i, 1);
        }
    });
    res.send(`deleted`);  
});

module.exports = router;
