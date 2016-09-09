// grabs current url
var currentUrl = window.location.origin;

//sends post to database
$('#postNews').on('click', function(){
	// saves data in variables
	var title = $('#postTitle').val().trim();
	var body = $('#postBody').val().trim();
	// sends data to back end
	$.ajax({
		url: currentUrl + '/savePost',
		method: 'POST',
		data: {
			postTitle: title,
			postBody: body
		},
		success: function(response){
			if(response = 'success'){
				$('#blogSuccess').modal('toggle');
			}
		}
	});

	$('#postTitle').val('');
	$('#postBody').val('');

	return false;

});



// clears post inputs
$('#clearPostInputs').on('click', function(){

	$('#postTitle').val('');
	$('#postBody').val('');

	return false;
});

// logout function
$('#adminLogout').on('click', function(){

  $.ajax({url: currentUrl + '/logout', method: 'GET'}).done(function(response){

    if(response == 'logout'){

      window.location.reload(true);

    }

  });

});