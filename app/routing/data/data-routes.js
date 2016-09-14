var mongojs = require('mongojs');

module.exports = function(app, db){
//post routes

	// saves blog post in database
	app.post('/savePost', function(req, res){

		db.posts.insert({
			title: req.body.postTitle,
			body: req.body.postBody,
			comments: []
		});

		res.json('success');

	});

	// deletes post for DB
	app.post('/deletePost', function(req, res){

		db.posts.remove({_id: mongojs.ObjectId(req.body.objId)}, function(err, docs){
			if(docs.ok == 1 || docs.n == 1){
				res.json('deleted');
			}
		});

	});

	// updates an edited post
	app.post('/editPost', function(req, res){
		var newTitle = req.body.postTitle;
		var newBody = req.body.postBody;
		db.posts.update({_id: mongojs.ObjectId(req.body.objId)}, 
						{$set: {

							title: newTitle,
							body: newBody

							}
						},
						 function(err, docs){
								res.json(docs.ok);
						});

	});


//===============================================================
	// saves chat logs
	app.post('/saveChat', function(req, res){

	 	db.rooms.update({_id: mongojs.ObjectId(req.body.objId)},{$push: {"chatLog": req.body.message}});

	 });


	app.get('/getLog', function(req, res){

		db.rooms.find({}, function(err, docs){
			
			res.json(docs);
		});

	});




	// retrieves blog posts for user view
	app.get('/getPosts', function(req, res){

		db.posts.find({}, function(err, docs){

			res.json(docs);

		});

	});

	// gets room data for admin panel
	app.get('/getLabs', function(req, res){

		db.rooms.find({}, function(err, docs){
			res.json(docs);
		});

	});

	// deletes lab of users choosing
	app.post('/deleteLab', function(req, res){

		db.rooms.remove({_id: mongojs.ObjectId(req.body.objId)}, function(err, docs){
			if(docs.ok == 1 || docs.n == 1){
				res.json('deleted')
			}
		});

	});

	// creates new lab
	app.post('/newLab', function(req, res){
		
		db.rooms.insert({
			name: req.body.labName,
			chatLog: []
		}, function(err, docs){
			if(docs == null || docs == undefined) {
				res.json('invalid');
			}
			else{
				res.json({
					name: docs.name,
					_id: docs._id
				});
			}
			
			
		});

	});

//==================
//Edit/add users
//==================
// gets users data for admin
	app.get('/getUsers', function(req, res){
		db.users.find({}, function(err, docs){
			res.json(docs);
		});
	});
// edits user
	app.post('/editUser', function(req, res){

		var newFn = req.body.firstName;
		var newLn = req.body.lastName;
		var newUn = req.body.userName;
		var newPassword = req.body.password;
		var id = req.body.id;

		db.users.update({_id: mongojs.ObjectId(id)}, 
						{$set: {

							firstName: newFn,
							lastName: newLn,
							userName: newUn,
							password: newPassword,	

							}
						},
						 function(err, docs){
								res.json(docs.ok);
						});

	});
// adds user(from admin)
	app.post('/addUser', function(req, res){

		db.users.insert({
							firstName: req.body.fn, 
							lastName: req.body.ln,
							userName: req.body.un,
							password: req.body.pw
						}, function(err, docsTwo){
							res.json('success');
						});

	});
// delete user(from admin)
	app.post('/deleteUser', function(req, res){

		var id = req.body.id;

		db.users.remove({_id: mongojs.ObjectId(id)}, function(err, docs){
			if(docs.ok == 1 || docs.n == 1){
				res.json('done');
			}
		});	

	});

//=======================================
//admin/ user settings (GET and POST)
//GET's
app.get('/getusersets', function(req, res){

	db.users.find({userName: req.session.userName}, function(err, docs){

		res.json(docs[0]);

	});

});

app.get('/getadminsets', function(req, res){

	db.admin.find({}, function(err, docs){
		res.json(docs[0]);
	});

});

//POST's
app.post('/setusersets', function(req, res){

		db.users.update({_id: mongojs.ObjectId(req.body.id)}, 
						{$set: {

							firstName: req.body.fn,
							lastName: req.body.ln,
							userName: req.body.un,
							password: req.body.pw	

							}
						},
						 function(err, docs){
								res.json(docs.ok);
						});


});

app.post('/setadminsets', function(req, res){

		db.admin.update({_id: mongojs.ObjectId(req.body.id)}, 
						{$set: {

							firstName: req.body.fn,
							lastName: req.body.ln,
							password: req.body.pw,
							authKey: req.body.ak	

							}
						},
						 function(err, docs){
								res.json(docs.ok);
						});

});
//=======================================


};




