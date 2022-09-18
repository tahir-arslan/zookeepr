const path = require('path');
const router = require('express').Router();

// this will be the route used to create a homepage for a server
router.get('/', (req, res) => {
    // this path module ensures correct file path and can work in any server environment
    res.sendFile(path.join(__dirname, './public/index.html'));
});

router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
})

// catch all wildcard routes and redirect to homepage. this should always come last or else
// any route being entered will redirect to homepage since first line of code will take precidence
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

module.exports = router;