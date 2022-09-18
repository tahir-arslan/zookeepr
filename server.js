// const fs = require('fs');
// const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// const { animals } = require('./data/animals');
const express = require('express');
// heroku sets variable port to 80 by default
const PORT = process.env.PORT || 3001;
const app = express();

// middleware with instructions to make these files readily available
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// this way when client navigates to `<ourhost>/api`, app will use routers we set up in `apiRoutes`
// if `/` is endpoint, then router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// heroku runs app in an environment variable called process.env.PORT. we will tell app
// to use that port, and if not then use default port of 3001
// also, app.listen should, by convention, always be last
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});