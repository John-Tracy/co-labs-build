var path = require('path');

module.exports = function(app, db, io){

// retrieving data for socket client to use
app.get('/socketConnect', function(req, res){

	var userName = req.session.userName;

	db.users.find({userName: userName}, function(err, docs){

		function capFirst(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		var fName = capFirst(docs[0].firstName);
		var color = docs[0].bgcolor;

		res.json({
			userName: userName,
			fName: fName,
			color: color
		
		})
	});

});


var nickNames = []; // this array holds current users online to be sent all client sockets for display
// io socket listener for on connenction
io.on('connection', function(socket){
	
	var updateUsers = function(array){
		io.emit('onlineUsers', array);
	}


	// for messages to be emitted to all users
	socket.on('message', function(idNum, chatMessage, userName){

		io.emit('new', idNum, chatMessage, userName);

	});

	//  emit new online user
	socket.on('online', function(userName){
		socket.nickName = userName;
		nickNames.push(userName);
		updateUsers(nickNames);

	});

	// fires when admin updates or creates a  new blog post
	socket.on('updateBlog', function(){
		
		io.emit('refreshBlog');

	});


	// when client socket side disconnects
	  socket.on('disconnect', function(){
	  	if(socket.nickName != undefined){
	  		nickNames.splice(nickNames.indexOf(socket.nickName), 1);
	  		updateUsers(nickNames);
	  	}
	  });

});

};