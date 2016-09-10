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

// user logout
$('#userLogout').on('click', function(){

  $.ajax({url: currentUrl + '/logout', method: 'GET'}).done(function(response){

    if(response == 'logout'){

      window.location.reload(true);

    }

  });

});