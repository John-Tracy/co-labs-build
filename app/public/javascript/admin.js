// grabs current
var currentUrl = window.location.origin;

$('#adminLogout').on('click', function(){

  $.ajax({url: currentUrl + '/logout', method: 'GET'}).done(function(response){

    if(response == 'logout'){

      window.location.reload(true);

    }

  });

});