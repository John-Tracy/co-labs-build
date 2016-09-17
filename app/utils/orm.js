// Database configuration
var mongojs = require('mongojs');
var databaseUrl = 'colabs' //local use
//var databaseUrl = 'mongodb://heroku_zn9vl4pb:8tepj5i8cbe62civkraoduvoc7@ds027896.mlab.com:27896/heroku_zn9vl4pb'; // heroku deployment use
var collections = ['admin', 'users', 'posts', 'rooms'];
//  mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});


var map = {

		adminLogin: function (password, callback) {
			
			db.admin.find({password: password}, function(err, docs){
				
				return callback(docs);

			})

		},

		userByUn: function (userName, callback) {

			db.users.find({userName: userName}, function(err, docs){

				return callback(docs);

			})

		},

		adminAll: function (callback) {

			db.admin.find({}, function(err, docs){

				return callback(docs);

			});

		},

		initAdmin: function(fName, lName, pWord, authKey, callback) {

			db.admin.insert({
							firstName: fName,
							lastName: lName,
							password: pWord,
							authKey: authKey,
							bgcolor: '#d4d4d4' }, function(err, doc){
								callback('success');
						});

		},

		initUser: function (fn, ln, un, pw, callback){

				db.users.insert({
							firstName: fn, 
							lastName: ln,
							userName: un,
							password: pw,
							bgcolor: '#d4d4d4' }, function(err, docsTwo){
								callback('success');
						});

		},

		userCheckUn: function (userName, callback) {

			db.users.find({"userName": {$in: [userName]}}, function(err, doc){

				callback(doc);

			});

		},

		savePost: function(title, body, callback) {

			db.posts.insert({
				title: title,
				body: body,
				comments: []
			});
			callback();
		},

		deletePost: function(objId, callback) {

			db.posts.remove({_id: mongojs.ObjectId(objId)}, function(err, docs){
				callback(docs);
			});

		}

};

module.exports = map;	

