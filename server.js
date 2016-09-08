// Initialize Express, express-session and body-parser 
var express = require('express');
session = require('express-session');
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

// initializing express session middleware
app.use(session({
    secret: 'colabsMiddleware',
    resave: true,
    saveUninitialized: false
}));

// init Web Socktet
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Database configuration
var mongojs = require('mongojs');
var databaseUrl = 'colabs'
//var databaseUrl = "mongodb://heroku_2b8v8x22:e4ckvcagn9qnsk7bv7vse0mfnn@ds139725.mlab.com:39725/heroku_2b8v8x22";
var collections = ['admin', 'users'];
//  mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

// ROUTES
// ===========================================================
require('./app/routing/data/data-routes.js')(app, db);
require('./app/routing/html/html-routes.js')(app);
require('./app/routing/userAuth/auth.js')(app, db);
require('./app/routing/newUser/newUser.js')(app, db);
require('./app/routing/sockets/socket.js')(app, db, io);

// Starts the server 
// =============================================================
http.listen(PORT, function() {
	console.log('App listening on PORT ' + PORT);
});