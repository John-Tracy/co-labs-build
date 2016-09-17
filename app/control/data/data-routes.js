//=========================
//control file for getting
//and posting data
//=========================
// map object contains all models
var map = require('../../utils/orm.js');


module.exports = function(app){
//post routes

	// saves blog post in database
	app.post('/savePost', function(req, res){

		var title = req.body.postTitle;
		var body = req.body.postBody;
	
		map.savePost(title, body, function(dbRes){

			res.json('success');

		});

	});

	// deletes post for DB
	app.post('/deletePost', function(req, res){

		map.deletePost(req.body.objId, function(dbRes){
			if(dbRes.ok == 1 || dbRes.n == 1){
				res.json('deleted');
			}
		});
		

	});

	// updates an edited post
	app.post('/editPost', function(req, res){
		var newTitle = req.body.postTitle;
		var newBody = req.body.postBody;
		var objId = req.body.objId;
	
		map.updatePost(objId, newTitle, newBody, function(dbRes){

			res.json(dbRes);

		})

	});

//===============================================================
	// saves chat logs
	app.post('/saveChat', function(req, res){

		var objId = req.body.objId;
		var message = req.body.message;
	 
	 	map.saveChat(objId, message, function(dbRes){
	 		res.json(dbRes);
	 	});
	 });


	app.get('/getLog', function(req, res){

		map.allRooms(function(dbRes){
			res.json(dbRes);
		});

	});

	// retrieves blog posts for user view
	app.get('/getPosts', function(req, res){

			map.allPosts(function(dbRes){
				res.json(dbRes);
			});

	});

	// gets room data for admin panel
	app.get('/getLabs', function(req, res){

		map.allRooms(function(dbRes){		
			res.json(dbRes);
		});

	});

	// deletes lab of users choosing
	app.post('/deleteLab', function(req, res){

		map.deleteRoom(req.body.objId, function(dbRes){
			if(dbRes.ok == 1 || dbRes.n == 1){
				res.json('deleted')
			}
		});

	});

	// creates new lab
	app.post('/newLab', function(req, res){
		
		map.newRoom(req.body.labName, function(dbRes){

			if(dbRes == null || dbRes == undefined) {
				res.json('invalid');
			}
			else{
				res.json({
					name: dbRes.name,
					_id: dbRes._id
				});
			}
		});

	});

//==================
//Edit/add users
//==================
// gets users data for admin
	app.get('/getUsers', function(req, res){
		//db.users.find({}, function(err, docs){
		map.allUsers(function(dbRes){
			res.json(dbRes);
		});
		//});
	});
// edits user
	app.post('/editUser', function(req, res){

		var newFn = req.body.firstName;
		var newLn = req.body.lastName;
		var newUn = req.body.userName;
		var newPassword = req.body.password;
		var id = req.body.id;

		map.updateUser(newFn, newLn, newUn, newPassword, id, function(dbRes){
			res.json(dbRes);
		});

	});
// adds user(from admin)
	app.post('/addUser', function(req, res){

		var fn = req.body.fn;
		var ln = req.body.ln;
		var un = req.body.un;
		var pw = req.body.pw;

		map.userCheckUn(un, function(dbRes){

			if(!dbRes[0]){

				map.initUser(fn, ln, un, pw, function(dbResTwo){

					res.json(dbResTwo);

				});

			}
			else{
				res.json('invalid');
			}

		});
			
	});
// delete user(from admin)
	app.post('/deleteUser', function(req, res){

		var id = req.body.id;

		map.deleteUser(id, function(dbRes){
			if(dbRes.ok == 1 || dbRes.n == 1){
				res.json('done');
			}	
		});

	});

app.get('/initAdmin', function(req, res){

	//db.admin.find({}, function(err, docs){
	map.adminAll(function(dbRes){
		res.json(dbRes[0].bgcolor);
	});
	//});

});

//=======================================
//admin/ user settings (GET and POST)
//GET's
app.get('/getusersets', function(req, res){

	map.userByUn(req.session.userName, function(dbRes){
		res.json(dbRes[0]);
	});

});

app.get('/getadminsets', function(req, res){

	//db.admin.find({}, function(err, docs){
	map.adminAll(function(dbRes){
		res.json(dbRes[0]);
	});
	//});

});

//POST's
app.post('/setusersets', function(req, res){

		var fn = req.body.fn;
		var ln = req.body.ln;
		var un = req.body.un;
		var pw = req.body.pw;
		var col = req.body.color;
		var id = req.body.id;

		map.userSets(fn, ln, un, pw, col, id, function(dbRes){
			res.json({ 
					status: dbRes.ok,
					color: col
				});
		});

});

app.post('/setadminsets', function(req, res){

		var id = req.body.id
		var fn = req.body.fn
		var ln = req.body.ln
		var pw = req.body.pw
		var ak = req.body.ak
		var	col = req.body.color

		map.updateAdmin(fn, ln, pw, ak, col, id, function(dbRes){
			res.json({
				status: dbRes.ok,
				color: col
			});
		});

});
//=======================================

};
