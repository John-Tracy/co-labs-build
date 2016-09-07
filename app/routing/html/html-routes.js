var path = require('path');

module.exports = function(app){


	app.use(function(req, res){
		console.log(req.session);
		if(!req.session.isAdmin && !req.session.userAuth){
			res.sendFile(path.join(__dirname + '/../../public/html/login.html'));
		}


	});


};