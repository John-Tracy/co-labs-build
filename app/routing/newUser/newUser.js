var path = require('path');

module.exports = function(app, db, validation){

	var validation;
	// grabs validation key for initing new users
	db.admin.find({}, function(err, docs){
		validation = docs[0].authKey;
	});
	
	// new user pushed to database
	app.post('/newUser', function(req, res){

		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var userName = req.body.userName;
		var password = req.body.password;
		var authKey = req.body.authKey;

		if(validation == authKey){
			db.users.insert({
				firstName: firstName, 
				lastName: lastName,
				userName: userName,
				password: password
			});
			res.json('success');
		}
		else{
			res.json('invalid');
		}
		
		
	});


};