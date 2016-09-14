var path = require('path');

module.exports = function(app, db){

	// new user pushed to database
	app.post('/newUser', function(req, res){

		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var userName = req.body.userName;
		var password = req.body.password;
		var authKey = req.body.authKey;
			// grabs validation key for initing new users
		db.admin.find({}, function(err, docs){
			if(authKey = docs[0].authKey){
				db.users.insert({
					firstName: firstName, 
					lastName: lastName,
					userName: userName,
					password: password
				}, function(err, docsTwo){
					res.json('success');
				});
			}
			else{
				res.json('invalid');
			}
		});
		
	});


// ==================================================
// This Route is for verification that this is or 
// is not a new instance of Co-Labs.
	app.get('/check', function(req, res){

		db.admin.find({}, function(err, docs){

			if(!docs[0]){
				res.json('new');
			}
			else if(docs[0]){
				res.json('verified')
			}

		});

	});
// This route is only used to save the initial Admin 
// information upon first time load up of the product
	app.post('/newAdmin', function(req, res){
		var fName = req.body.fName;
		var lName = req.body.lName;
		var pWord = req.body.pWord;
		var authKey = req.body.authKey;

		db.admin.insert({
						firstName: fName,
						lastName: lName,
						password: pWord,
						authKey: authKey
						}, 
						function(err, doc){
							res.json('success');
						})
	});
// ==================================================





};