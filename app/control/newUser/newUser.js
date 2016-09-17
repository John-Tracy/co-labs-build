//=============================
//new user/admin control
//file 
// also for new collabs install
//=============================

// map object contains all models
var map = require('../../utils/orm.js');

module.exports = function(app){

	// new user pushed to database
	app.post('/newUser', function(req, res){

		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var userName = req.body.userName;
		var password = req.body.password;
		var authKey = req.body.authKey;

					// grabs validation key for initing new users
		map.userCheckUn(userName, function(dbRes){
					
			if(dbRes[0] == undefined){
			//	db.admin.find({}, function(err, docs){
				map.adminAll(function(dbResTwo){

					if(authKey = dbResTwo[0].authKey){

						map.initUser(firstName, lastName, userName, password, function(dbResTres){

							res.json(dbResTres);

						})
					}
					else{
						res.json('invalid');
					}
				});
			
			}
			else if(dbRes[0] != undefined){
				res.json('taken');
			}
		});
		
	});
// ==================================================
// This Route is for verification that this is or 
// is not a new instance of Co-Labs.
	app.get('/check', function(req, res){

	//	db.admin.find({}, function(err, docs){
		map.adminAll(function(dbRes){

			if(!dbRes[0]){
				res.json('new');
			}
			else if(dbRes[0]){
				res.json('verified')
			}

		});
	//	});

	});
// This route is only used to save the initial Admin 
// information upon first time load up of the product
	app.post('/newAdmin', function(req, res){
		var fName = req.body.fName;
		var lName = req.body.lName;
		var pWord = req.body.pWord;
		var authKey = req.body.authKey;

		map.initAdmin(fName, lName, pWord, authKey, function(dbRes){
			res.json(dbRes);
		})

	});
// ==================================================

};