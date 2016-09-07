// Initialize Express and body-parser app
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

// uses any static files required by the html files.
app.use(express.static('./app/public/'));

// Sets up the Express app to handle data parsing 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


// ROUTES
// ===========================================================
require('./app/routing/data/data-routes.js')(app);
require('./app/routing/html/html-routes.js')(app);

// Starts the server 
// =============================================================
app.listen(PORT, function() {
	console.log('App listening on PORT ' + PORT);
});