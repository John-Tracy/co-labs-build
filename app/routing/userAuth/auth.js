var map = require('../../utils/orm.js');

module.exports = function(app){

	app.post('/adminLogin', function(req, res){
		
		var password = req.body.password;

		// db.admin.find({password: password}, function(err, docs){

		// 	if(!docs[0]){
		// 		res.json('invalid');
		// 	}
		// 	else if(docs[0].password == password){
		// 		req.session.isAdmin = true;
		// 		res.json('success');
		// 	}

		// });
		map.adminLogin(password, function(dbRes){
			if(!dbRes[0]){
				res.json('invalid')
			}
			else if(dbRes[0].password == password){
				req.session.isAdmin = true;
				res.json('success');
			}
		})

	});

	app.post('/userLogin', function(req, res){
		var userName = req.body.userName;
		var password = req.body.password;

	//	db.users.find({userName: userName}, function(err, docs){

			
		map.userByUn(userName, function(dbRes){

				if(!dbRes[0]){
					res.json('invalid-username');
				}
				else if(password == dbRes[0].password){
					req.session.userAuth = true;
					req.session.userName = dbRes[0].userName;
					res.json('success');

				}
				else if(password != dbRes[0].password){
					res.json('invalid-password');
				}

			});
	//	});

	});

	app.get('/logout', function(req, res){

		req.session.destroy();

		res.json('logout');

	});



};