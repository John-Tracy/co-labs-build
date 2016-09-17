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

// ROUTES
// ===========================================================
require('./app/control/data/data-routes.js')(app);
require('./app/routing/html/html-routes.js')(app);
require('./app/control/userAuth/auth.js')(app);
require('./app/control/newUser/newUser.js')(app);
require('./app/control/sockets/socket.js')(app, io);

// Starts the server 
// =============================================================
http.listen(PORT, function() {
	console.log('App listening on PORT ' + PORT);
});