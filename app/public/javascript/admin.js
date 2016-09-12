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
//=============================
// admin chat lab manipulation

	//gets list of chat labs to be edited

$.ajax({url: currentUrl + '/getLabs', method: 'GET'}).done(function(data){

	for(var i = 0; i < data.length; i++){

		var li = $('<li class="list-group-item" id="' + data[i]._id + 'li">').html('Lab Name: ' + data[i].name);
		var p= $('<p class="delMessage">').html('     Delete Chat Lab');
		var chatNum = $('<span class="badge" data-toggle="tooltip" title="# of messages in lab">').html(data[i].chatLog.length);
		var delGlyp = $('<span class="glyphicon glyphicon-trash delLab" data-index="' + data[i]._id + '" data-name="' + data[i].name + '">');

		li.append(chatNum);
		p.prepend(delGlyp);
		li.append(p);

		$('#labList').append(li);
	}

});

	// deletes chat lab
$(document).on('click', '.delLab', function(){

	var id = $(this).attr('data-index');
	var name = $(this).attr('data-name');

	var yesNo = confirm('Are you Sure you want to delete "' + name + '" and all of it\'s contents?'); // might change this to a modal
 
 	if(yesNo == true){
		$.ajax({
			url: currentUrl + '/deleteLab',
			method: 'POST',
			data: {
				objId: id
			},
			success: function(response){
				//nothing special
				if(response == 'deleted'){
					$('#' + id + 'li').remove();
				}
			}
		});
	}
	else if(yesNo == false){
		return false;
	}

});


	// creates new chat lab

$('#newLabButton').on('click', function(){
	var labName = $('#newLabInput').val().trim();
	$('#newLabInput').val('');
	if(labName == '' || labName == null){
		return false;
	}
	else {

		$.ajax({
			url: currentUrl + '/newLab',
			method: 'POST',
			data:{
				labName: labName
			},
			success: function(response){
						var li = $('<li class="list-group-item" id="' + response._id + 'li">').html('Lab Name: ' + response.name);
						var p= $('<p class="delMessage">').html('     Delete Chat Lab');
						var chatNum = $('<span class="badge" data-toggle="tooltip" title="# of messages in lab">').html('0');
						var delGlyp = $('<span class="glyphicon glyphicon-trash delLab" data-index="' + response._id + '" data-name="' + response.name + '">');

						li.append(chatNum);
						p.prepend(delGlyp);
						li.append(p);

						$('#labList').append(li);
			}
		});

	}

	return false
});
//=============================



//==================================
// Post Edit/Delete logic
$.ajax({url: currentUrl + '/getPosts', method: 'GET'}).done(function(response){

	for(var i = response.length -1; i >= 0; i--){
		
		var li = $('<li class="list-group-item">').html('Title: ' + response[i].title);
			li.attr('id', response[i]._id + 'postli');

		var delIcon = $('<span class="glyphicon glyphicon-trash delPost">').attr('data-index', response[i]._id);

		var editIcon = $('<span class="glyphicon glyphicon-pencil editPost">').attr('data-index', response[i]._id);
			editIcon.attr('data-title', response[i].title);
			editIcon.attr('data-body', response[i].body);

		var pTag = $('<p>');
			pTag.append(delIcon);
			pTag.append('<-delete-|-edit->')
			pTag.append(editIcon);

			li.append(pTag);

		$('#postList').append(li)
	}

});

	// delete post
$(document).on('click', '.delPost', function(){

	var objId = $(this).attr('data-index');
	console.log(objId);
	$.ajax({
		url: currentUrl + '/deletePost',
		method: 'POST',
		data: {
			objId: objId
		},
		success: function(res){
			if(res == 'deleted'){
				$('#' + objId + 'postli').remove();
			}
		}
	});



});
	
	// Edit Post invoke editor
$(document).on('click', '.editPost', function(){

	var currentId = $(this).attr('data-index');
	console.log(currentId);
	var currentTitle = $(this).attr('data-title');
	console.log(currentTitle);
	var currentBody = $(this).attr('data-body');
	console.log(currentBody);

	$('#editPostTitle').val('');
	$('#editPostBody').val('');
	// $('postEditorSubmit').attr('data-index', '');

	$('#editPostTitle').val(currentTitle);
	$('#editPostBody').val(currentBody);
	$('#postEditorSubmit').attr('data-index', currentId);

	$('#postEditorModal').modal('toggle');

});

$('#postEditorSubmit').on('click', function(){

	var dbId = $('#postEditorSubmit').attr('data-index');
	console.log(dbId);
	var newTitle = $('#editPostTitle').val().trim();
	console.log(newTitle);
	var newBody = $('#editPostBody').val().trim();
	console.log(newBody);

	$.ajax({
		url: currentUrl + '/editPost',
		method: 'POST',
		data: {
			objId: dbId,
			postTitle: newTitle,
			postBody: newBody
		},
		success: function(res){
			if(res == 1){
				var timeDelay;

				function showPopover() {
					$('#postEditorSubmit').popover('show');
					timDelay = setTimout(closePopover, 2500);
				};
				function closePopver() {
					$('#postEditorSubmit').popover('hide');
					clearTimeout(timeDelay);
				};

				showPopover();

			};
		}
	})
});


//==================================




// switching admin panes through side nav clicks

	// opens chat lab editor
$('#editLab').on('click', function(){

	$('.content-panel').hide();

	$('#editLabPanel').show();

});

	//opens new post form panel

$('#newPostTab').on('click', function(){

	$('.content-panel').hide();

	$('#newPostPanel').show();

});

$('#editPostTab').on('click', function(){

	$('.content-panel').hide();

	$('#editPostPanel').show();

});





