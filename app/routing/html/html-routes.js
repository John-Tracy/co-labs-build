var path = require('path');

module.exports = function(app){


	app.use(function(req, res){

		res.sendFile(path.join(__dirname + '/../../public/html/login.html'));

	});


};