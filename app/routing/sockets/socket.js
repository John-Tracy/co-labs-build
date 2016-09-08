var path = require('path');

module.exports = function(app, db, io){

// retrieving data for socket client to use
app.get('/socketConnect', function(req, res){

	var userName = req.session.userName;

	res.json(userName);

});



// io socket listener for on connenction
io.on('connection', function(socket){

	// io.of('/').clients(function(error, clients){
	//   if (error) throw error;
	//   console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD] 
	// });
	socket.on('message', function(message, name, roomNum){

		io.emit('new', message, name, roomNum);

	});



	// when client socket side disconnects
	  socket.on('disconnect', function(){
	  	console.log('user disconnect');
	  });

});

};