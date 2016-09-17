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

//==============================
// program model
//==============================
var map = {

		adminLogin: function (password, callback) {
			
			db.admin.find({password: password}, function(err, docs){
				
				return callback(docs);

			})

		},

		updateAdmin: function(fn, ln, pw, ak, col, id, callback) {

			db.admin.update({_id: mongojs.ObjectId(id)}, 
						{$set: {

							firstName: fn,
							lastName: ln,
							password: pw,
							authKey: ak,
							bgcolor: col	
							}
						},
						 function(err, docs){
							callback(docs);
						});	

		},

		userByUn: function (userName, callback) {

			db.users.find({userName: userName}, function(err, docs){

				return callback(docs);

			})

		},

		allUsers: function(callback) {

			db.users.find({}, function(err, docs){
				callback(docs);
			});

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

		deleteUser: function(id, callback) {

			db.users.remove({_id: mongojs.ObjectId(id)}, function(err, docs){
					callback(docs);
			});			

		},

		updateUser: function(fn, ln, un, pw, id, callback) {

			db.users.update({_id: mongojs.ObjectId(id)}, 
						{$set: {

							firstName: fn,
							lastName: ln,
							userName: un,
							password: pw,	

							}
						},
						 function(err, docs){
								callback(docs.ok);
						}
			);

		},

		userSets: function(fn, ln, un, pw, col, id, callback) {

			db.users.update({_id: mongojs.ObjectId(id)}, 
						{$set: {

								firstName: fn,
								lastName: ln,
								userName: un,
								password: pw,
								bgcolor: col	

								}
						},
						 function(err, docs){
							callback(docs);
						});
		

		},


		allPosts: function(callback) {

			db.posts.find({}, function(err, docs){

				callback(docs);

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

		updatePost: function(objId, title, body, callback) {

			db.posts.update({_id: mongojs.ObjectId(objId)}, 
							{$set: {

								title: title,
								body: body

								}
							},
							 function(err, docs){
									callback(docs.ok);
							});

		},

		deletePost: function(objId, callback) {

			db.posts.remove({_id: mongojs.ObjectId(objId)}, function(err, docs){
				callback(docs);
			});

		},

		saveChat: function(objId, message, callback) {

		 	db.rooms.update({_id: mongojs.ObjectId(objId)},{$push: {"chatLog": message}}, function(err, docs){
	 			callback('success');
	 		});

		},

		allRooms: function(callback) {

			db.rooms.find({}, function(err, docs){
				callback(docs);
			});

		},

		deleteRoom: function(objId, callback) {

			db.rooms.remove({_id: mongojs.ObjectId(objId)}, function(err, docs){
			
				callback(docs);
			
			});

		},

		newRoom: function(name, callback) {

			db.rooms.insert({
				name: name,
				chatLog: []
			}, function(err, docs){
				callback(docs)
			});

		}

};

module.exports = map;	

