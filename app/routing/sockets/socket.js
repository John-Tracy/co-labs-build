var path = require('path');

module.exports = function(app, db, io){

// retrieving data for socket client to use
app.get('/socketConnect', function(req, res){

	var userName = req.session.userName;

	res.json(userName);

});


var nickNames = [];
// io socket listener for on connenction
io.on('connection', function(socket){

	// io.of('/').clients(function(error, clients){
	//   if (error) throw error;
	//   console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD] 
	// });
	
	var updateUsers = function(array){
		io.emit('onlineUsers', array);
	}


	// for messages to be emitted to all users
	socket.on('message', function(message, name, roomNum){

		io.emit('new', message, name, roomNum);

	});

	// to emit online user
	socket.on('online', function(userName){
		socket.nickName = userName;
		nickNames.push(userName);
		updateUsers(nickNames);

	});


	// when client socket side disconnects
	  socket.on('disconnect', function(){
	  	console.log('logging out: ' + socket.nickName);
	  	nickNames.splice(nickNames.indexOf(socket.nickName), 1);
	  	updateUsers(nickNames);
	  });

});

};