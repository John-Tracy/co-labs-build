var path = require('path');

module.exports = function(app){


	app.get('/', function(req, res){
		console.log('getting login');
		if(!req.session.isAdmin && !req.session.userAuth){
			res.sendFile(path.join(__dirname + '/../../public/html/login.html'));
		}


	});


};