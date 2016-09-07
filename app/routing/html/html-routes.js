var path = require('path');

module.exports = function(app){


	app.get('/', function(req, res){
		console.log(req.session);
		if(!req.session.isAdmin && !req.session.userAuth){
			res.sendFile(path.join(__dirname + '/../../public/html/login.html'));
		}
		else if(req.session.isAdmin == true){
			res.sendFile(path.join(__dirname + '/../../public/html/admin.html'));
		}
		else if(req.session.userAuth == true){
			res.sendFile(path.join(__dirname + '/../../public/html/user.html'));
		}


	});


};