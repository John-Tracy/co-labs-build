var path = require('path');

module.exports = function(app, db){

	// saves blog post in database
	app.post('/savePost', function(req, res){

		db.posts.insert({
			title: req.body.postTitle,
			body: req.body.postBody
		});

		res.json('success');

	});

	// retrieves blog posts for user view
	app.get('/getPosts', function(req, res){

		db.posts.find({}, function(err, docs){

			res.json(docs);

		});

	});
};




