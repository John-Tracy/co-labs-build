var mongojs = require('mongojs');

module.exports = function(app, db){
//post routes

	// saves blog post in database
	app.post('/savePost', function(req, res){

		db.posts.insert({
			title: req.body.postTitle,
			body: req.body.postBody
		});

		res.json('success');

	});

	// saves chat logs
	app.post('/saveChat', function(req, res){

	 	db.rooms.update({_id: mongojs.ObjectId(req.body.objId)},{$push: {"chatLog": req.body.message}});

	 });


	app.get('/getLog', function(req, res){

		db.rooms.find({}, function(err, docs){
			
			res.json(docs);
		});

	});


// GET routes

	// retrieves blog posts for user view
	app.get('/getPosts', function(req, res){

		db.posts.find({}, function(err, docs){

			res.json(docs);

		});

	});
};




