const fs = require('fs');
const path = require('path');

const { animals } = require('./data/animals');
const express = require('express');
// heroku sets variable port to 80 by default
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());


function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as dedicated array
        // if personalityTraits is string, place into new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // check trait against each animal in filteredResults.array
            // note: initially this is a copy of the animasArray, but here we are updating it
            // for each trait in the `.forEach()` loop. for each trait being targeted by the filter,
            // filteredResults array will contain only enteries containing trait, so result will
            // be an array of animals that have the traits when the `.forEach()` loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return filtered results:
    return filteredResults;
}

// can use `.filterByQuery()` but since this route will only return a single animal due to it's
// it's unique id, no need for the extra code
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // if we were writing to a larger dataset, async version would be better (`fs.writeFile()`)
    // `fs.writeFileSync()` is the synchronous version of `fs.writeFile()`
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // save javascript array data as JSON -> `JSON.stringify()`
        // null means we don't want to edit any of our existing data, `2` indicates we to create
        // whtie space between our values to make it more readable
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to POST 
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// if search parameter not found, send 404
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
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

// heroku runs app in an environment variable called process.env.PORT. we will tell app
// to use that port, and if not then use default port of 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});