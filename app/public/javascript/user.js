// room changes ===========================
$('#room2button').on('click', function(){
  $('#room1').hide();
  $('#room3').hide();
  $('#room4').hide();
  $('#room2').show();
})

$('#room1button').on('click', function(){
  $('#room2').hide();
  $('#room3').hide();
  $('#room4').hide();
  $('#room1').show();
})

$('#room3button').on('click', function(){
  $('#room1').hide();
  $('#room2').hide();
  $('#room4').hide();
  $('#room3').show();
})

$('#room4button').on('click', function(){
  $('#room1').hide();
  $('#room2').hide();
  $('#room3').hide();
  $('#room4').show();
})
// room changes ===========================


//grabs current url
var currentUrl = window.location.origin;
//connects socket
var socket = io.connect();

//ajax get request to init sockect with user info
$.ajax({url: currentUrl + '/socketConnect', method: 'GET'}).done(function(response){

  socket.userName = response;

  socket.emit('online', socket.userName);
  
});

// socket ==============================================

if(socket != undefined){
  socket.on('onlineUsers', function(nickNames){
    $('#userPool').empty();
    for(var i = 0; i < nickNames.length; i++){
      var ptag = $('<p>');
      ptag.html('<span class="glyphicon glyphicon-globe"></span> ' + nickNames[i]);
      $('#userPool').append(ptag);
    }


  });
}

$(document).on('click', '.sendMes',function() {
  
  var roomNum = $(this).attr('data-index');
  var message = $('#chat-input' + roomNum.toString()).val().trim();
  $('#chat-input' + roomNum.toString()).val('');
  var name = socket.userName;

  socket.emit('message', message, name, roomNum.toString());

  return false;
});

if(socket != undefined){
  socket.on('new', function(message, name, roomNum){
    var ptag = $('<p>').html(name + ': ' + message);

    $('#box' + roomNum).append(ptag);
  });
}
// socket stuff end ===============================================


// gets and generates data for news panel
var blogMaker = function(data){

for(var i = data.length - 1; i >= 0; i--){
  var blogDiv = $('<div>');
  blogDiv.data('index', data[i]._id);
  var horRul = $('<hr>');
  var title = $('<h3>').html(data[i].title);
  var body = $('<p>').html(data[i].body);
  // building div
  blogDiv.append(title);
  blogDiv.append(body);
  blogDiv.append(horRul);

  // injects newly made div into html
  $('#news-content').append(blogDiv);
  $('#news-content').append('</br>');

}

};

$.ajax({url: currentUrl + '/getPosts', method: 'GET'}).done(function(response){

  blogMaker(response);

});

// end news data stuff

// generates chat rooms and corresponding buttons
var roomMaker = function(rooms){

    var isHidden = function(param){
      if(param == 0){
        return '';
      }
      else{
        return 'hidden';
      }
    }

    for(var i = 0; i < rooms.length; i++){

      var containDiv = $('<div class="panel panel-default chat-box hidadiv" id="' + rooms[i]._id + '" ' + isHidden(i) + '>');

      var h3 = $('<h3 class="panel-title">').html(rooms[i].name);

      var headingDiv = $('<div class="panel-heading">').append(h3);

      var bodyDiv = $('<div class="panel-body">').attr('id', rooms[i]._id);
        console.log(rooms[i])
        for(var x = 0; x < rooms[i].chatLog.length; x++){

          var tempP = $('<p>').html(rooms[i].chatLog[x]);

          bodyDiv.append(tempP);

        }

      var formButton = $('<button type="submit" class="btn btn-default sendMes" data-index="' + rooms[i]._id + '">').html('Send');

      var formInput = $('<input type="text" class="form-control" id="chat-input" data-index="' + rooms[i]._id + '"">');

      var theForm = $('<div class="form-inline">').append(formInput);
          theForm.append(formButton);

      var footerDiv = $('<div class="panel-footer">').append(theForm);

      containDiv.append(headingDiv);
      containDiv.append(bodyDiv);
      containDiv.append(footerDiv);

      $('#roomHolder').append(containDiv);
    }




}

// grabs room data
$.ajax({url: currentUrl + '/getLog', method: 'GET'}).done(function(response){

  roomMaker(response);

});

// end of chat rooms generation.



// user logout
$('#userLogout').on('click', function(){

  $.ajax({url: currentUrl + '/logout', method: 'GET'}).done(function(response){

    if(response == 'logout'){

      window.location.reload(true);

    }

  });

});