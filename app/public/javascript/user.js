
//grabs current url
var currentUrl = window.location.origin;
//connects socket
var socket = io.connect();

//ajax get request to init sockect with user info
$.ajax({url: currentUrl + '/socketConnect', method: 'GET'}).done(function(response){

  socket.userName = response.userName;

  socket.emit('online', socket.userName);
  
  $('#greetingText').html(response.fName);
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

var messageSender = function(){

  var idNum = $(this).attr('data-index');
  
  var chatMessage = $('#' + idNum + 'input').val().trim();

  $('#' + idNum + 'input').val('');

  var userName = socket.userName;

  socket.emit('message', idNum, chatMessage, userName);

      // sends chat off to be saved
      // sting is concatnated for DB
      var fullMes = userName + ': ' + chatMessage;
    $.ajax({
      url: currentUrl + '/saveChat',
      method: 'POST',
      data: {
        objId: idNum,
        message: fullMes
      },
      success: function(response){
        if(response){
          // saved.
        }
      }
     });
  
  return false;

};

// $.fn.scrollView = function () {
//   return this.each(function () {
//     $('.panel-body').animate({
//       scrollTop: $(this).offset().top
//     }, 500);
//   });
// }
// these directly use eachother... ^^^
$(document).on('click', '.sendMes', messageSender);

if(socket != undefined){
  socket.on('new', function(idNum, chatMessage, userName){
    
    var message = userName + ': ' + chatMessage;

    var pTag = $('<p>').html(message)
    var messageList = $('#' + idNum + 'body');
    messageList.append(pTag);


    messageList.scrollTop(messageList[0].scrollHeight);


  });
}
// socket stuff end ===============================================


// gets and generates data for news panel
var blogMaker = function(data){

  $('#news-content').empty();

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

function updateBlog(){
    $.ajax({url: currentUrl + '/getPosts', method: 'GET'}).done(function(response){

      blogMaker(response);

    });
}
// end news data stuff


// room changes ===========================
function roomChanger() {

  var idNum = $(this).attr('data-index');

  $('.hidadiv').hide();

  $('#' + idNum + 'room').show();

};
  
$(document).on('click', '.changeRoom', roomChanger)
// room changes ===========================

// generates chat rooms and corresponding buttons
var roomMaker = function(rooms){
// these stings are used 
  
    var isHidden = function(param){
      if(param == 0){
        return '';
      }
      else{
        return 'hidden';
      }
    }

// generates buttons for the rooms
  for(var i = 0; i < rooms.length; i++){
  
    var li = $('<li class="list-group-item changeRoom" data-index="' + rooms[i]._id + '">').html(rooms[i].name);
    $('#roomButtons').append(li);
  }
// generates room divs
    for(var i = 0; i < rooms.length; i++){

      var containDiv = $('<div class="panel panel-default chat-box hidadiv" id="' + rooms[i]._id + 'room' + '" ' + isHidden(i) + '>');

      var h3 = $('<h3 class="panel-title">').html(rooms[i].name);

      var headingDiv = $('<div class="panel-heading">').append(h3);

      var bodyDiv = $('<div class="panel-body">').attr('id', rooms[i]._id + 'body');

              
        // gets chatLog for each rooms iteration
        for(var x = 0; x < rooms[i].chatLog.length; x++){

          var tempP = $('<p>').html(rooms[i].chatLog[x]);

          bodyDiv.append(tempP);

        }

       

      var form = $('<form>');
      var formButton = $('<button type="submit" class="btn btn-default sendMes" data-index="' + rooms[i]._id + '">').html('Send');

      var formInput = $('<input type="text" class="form-control chat-input" id="' + rooms[i]._id + 'input' + '">');

          form.append(formInput);
          form.append(formButton);

      var theForm = $('<div class="form-inline">').append(form);
        

      var footerDiv = $('<div class="panel-footer">').append(theForm);

      containDiv.append(headingDiv);
      containDiv.append(bodyDiv);
      containDiv.append(footerDiv);

      $('#roomHolder').append(containDiv);

      bodyDiv.scrollTop(bodyDiv[0].scrollHeight);
    }




}

// grabs room data
$.ajax({url: currentUrl + '/getLog', method: 'GET'}).done(function(response){

  roomMaker(response);

});

// opens personal settings modal 
$('#userSettings').on('click', function(){

  $.ajax({url: currentUrl + '/getusersets', method: 'GET' }).done(function(res){

    $('#editUserFn').val(res.firstName);
    $('#editUserLn').val(res.lastName);
    $('#editUserUn').val(res.userName);
    $('#editUserPw').val(res.password);
    $('#userSetsSubmit').attr('data-index', res._id);

    $('#userSettingsModal').modal('toggle');

  });
  

});

// sends updated personal settings
$('#userSetsSubmit').on('click', function(){

  var fn = $('#editUserFn').val().trim();
  var ln = $('#editUserLn').val().trim();
  var un = $('#editUserUn').val().trim();
  var pw = $('#editUserPw').val().trim();
  var id = $('#userSetsSubmit').attr('data-index');

  $.ajax({
    url: currentUrl + '/setusersets',
    method: 'POST',
    data: {
      fn: fn,
      ln: ln,
      un: un,
      pw: pw,
      id: id
    },
    success: function(res){
      if(res == 1){
        var timeDelay;

        function showPopover() {
          $('#userSetsSubmit').popover('show');

          timDelay = window.setTimeout(closePopover, 2500);

        };

        function closePopover() {

          $('#userSetsSubmit').popover('hide');

          window.clearTimeout(timeDelay);

          $('#userSettingsModal').modal('toggle');

        };

        showPopover();
      }
    }
  });

});




// user logout
$('#userLogout').on('click', function(){

  $.ajax({url: currentUrl + '/logout', method: 'GET'}).done(function(response){

    if(response == 'logout'){

      window.location.reload(true);

    }

  });

});

socket.on('refreshBlog', function(){
 
  updateBlog();
});

updateBlog();