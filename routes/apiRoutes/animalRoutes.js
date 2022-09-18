const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// before, each route had `/api/animals` but removed `/api/` since our router function will
// be coded to append `/api/` to each URL
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// if search parameter not found, send 404
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/animals', (req, res) => {
    // set id based on what next index of array will be
    req.body.id = animals.length.toString();

    // validate data before updating file. if no, send 400. this is important so no invalid data
    // is accepted and stored, and it also allows for more consistent data to be saved which 
    // will help to avoid `what if` scenarios that would need to be factored in and coded for
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports = router;