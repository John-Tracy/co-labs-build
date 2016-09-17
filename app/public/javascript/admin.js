// grabs current url
var currentUrl = window.location.origin;

//connects socket
var socket = io.connect();

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
				// socket to emit to users to renew blog feed.
				socket.emit('updateBlog');

				$('#blogSuccess').modal('toggle');
				// empties div to delete repeat data in editor panel
				$('#postList').empty();
				// function to refresh blog edit data
				getBlogPosts();
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
function labFetch(){
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
	}; // end of labFetch()

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
function getBlogPosts(){

	$.ajax({url: currentUrl + '/getPosts', method: 'GET'}).done(function(response){

		if(response[0] != undefined){
			for(var i = response.length -1; i >= 0; i--){

				$('#postInstruct').html('Posts, from your last to your first...');
				var titleSpan = $('<span id="' + response[i]._id + 'titleText' + '">').html(response[i].title)
				var li = $('<li class="list-group-item">').html('Title: ');
					li.append(titleSpan);
					li.attr('id', response[i]._id + 'postli');

				var delIcon = $('<span class="glyphicon glyphicon-trash delPost">').attr('data-index', response[i]._id);

				var editIcon = $('<span class="glyphicon glyphicon-pencil editPost">').attr('data-index', response[i]._id);
					editIcon.attr('id', response[i]._id + 'edit')
					editIcon.attr('data-title', response[i].title);
					editIcon.attr('data-body', response[i].body);

				var pTag = $('<p>');
					pTag.append(delIcon);
					pTag.append('<-Delete-| |-Edit->')
					pTag.append(editIcon);

					li.append('<br>');
					li.append('<br>');

					li.append(pTag);

				$('#postList').append(li)
			}
		}
		else if(response[0] == undefined){
			$('#postInstruct').html('No Posts at this time...');
		}

	});

};

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
	
	var currentTitle = $(this).attr('data-title');

	var currentBody = $(this).attr('data-body');


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

	var newTitle = $('#editPostTitle').val().trim();

	var newBody = $('#editPostBody').val().trim();


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
				// socket emits 
				socket.emit('updateBlog');

				var timeDelay;

				function showPopover() {
					$('#postEditorSubmit').popover('show');

					// populates list item in edit panel with updated info
					$('#' + dbId + 'titleText').html(newTitle);
					$('#' + dbId + 'edit').attr('data-title', newTitle);
					$('#' + dbId + 'edit').attr('data-body', newBody);

					timDelay = window.setTimeout(closePopover, 1000);

				};

				function closePopover() {

					$('#postEditorSubmit').popover('hide');

					window.clearTimeout(timeDelay);

					$('#postEditorModal').modal('toggle');

				};

				showPopover();

			};
		}
	})
});
//==================================

//==================================
// edit/add users logic

//===========
//brings up user editor
$(document).on('click', '.userRow', function(){


	// saves proper values in 
	var fn = $(this).attr('data-fn'); 
	var ln = $(this).attr('data-ln');
	var un = $(this).attr('data-un');
	var pw = $(this).attr('data-pass');
	var id = $(this).attr('data-index');

	$('#editUserFn').val(fn)
	$('#editUserLn').val(ln)
	$('#editUserUn').val(un)
	$('#editUserPw').val(pw)
	//adds attr to submit button to send to db if used
	$('#userEditorSubmit').attr('data-index', id);
	// attr for object id in database
	$('#userEditorDelete').attr('data-index', id);


	// shows modal after values are set
	$('#userEditorModal').modal('toggle');
});
//===========

//===========
//sends data to be updated
$('#userEditorSubmit').on('click', function(){

	var objId = $('#userEditorSubmit').attr('data-index');
	var fName = $('#editUserFn').val().trim();
	var lName = $('#editUserLn').val().trim();
	var uName = $('#editUserUn').val().trim();
	var pWord = $('#editUserPw').val().trim();

	$('#editUserFn').val('');
	$('#editUserLn').val('');
	$('#editUserUn').val('');
	$('#editUserPw').val(''); // put thes in ajax callback


	$.ajax({
		url: currentUrl + '/editUser',
		method: 'POST',
		data: {
			firstName: fName,
			lastName: lName,
			userName: uName,
			password: pWord,
			id: objId
		},
		success: function(res){
			if(res == 1){
				var timeDelay;

				function showPopover() {
					$('#userEditorSubmit').popover('show');

					timDelay = window.setTimeout(closePopover, 1000);

				};

				function closePopover() {

					$('#userEditorSubmit').popover('hide');

					window.clearTimeout(timeDelay);

					$('#userEditorModal').modal('toggle');

				};

				showPopover();
			}
		}
	})
})

//===========
//add new user
$('#addNewUser').on('click', function(){

	var fn = $('#newUserFn').val().trim();
	var ln = $('#newUserLn').val().trim();
	var pw = $('#newUserPw').val().trim();
	var un = $('#newUserUn').val().trim();

	if(fn != '' && ln != '' && pw != '' && un != ''){

		$.ajax({
			url: currentUrl + '/addUser',
			method: 'POST',
			data: {
				fn: fn,
				ln: ln,
				un: un,
				pw: pw
			}, 
			success: function(res){
				if(res == 'success'){
					
				var timeDelay;

				function showPopover() {
					$('#addNewUser').popover('show');

					timDelay = window.setTimeout(closePopover, 1000);

				};

				function closePopover() {

					$('#addNewUser').popover('hide');

					window.clearTimeout(timeDelay);

					$('#newUserFn').val('');
					$('#newUserLn').val('');
					$('#newUserPw').val('');
					$('#newUserUn').val('');

				};

				showPopover();

				}
			}
		})

	}

return false;
});
	// clears inputs on add new user field
$('#clearNewUserInputs').on('click', function(){

	$('#newUserFn').val('');
	$('#newUserLn').val('');
	$('#newUserPw').val('');
	$('#newUserUn').val('');

	return false;

});
//===========
// user delete
$('#userEditorDelete').on('click', function(){

	var objectId = $('#userEditorDelete').attr('data-index');

	$.ajax({
		url: currentUrl + '/deleteUser',
		method: 'POST',
		data: {
			id: objectId
		},
		success: function(res){
			if(res == 'done'){
				var timeDelay;

				$('#' + objectId).remove();

				function showPopover() {
					$('#userEditorDelete').popover('show');

					timDelay = window.setTimeout(closePopover, 1000);

				};

				function closePopover() {

					$('#userEditorDelete').popover('hide');

					window.clearTimeout(timeDelay);

					$('#userEditorModal').modal('toggle');

				};

				showPopover();
			}
		}
	})

});
//===========

//============
//tr component
function trMaker(data){

	$('#userTable').empty();

	for(var i = 0; i < data.length; i++){

		var tr = $('<tr class="userRow">');
			tr.attr('id', data[i]._id);
			tr.attr('data-index', data[i]._id);
			tr.attr('data-pass', data[i].password);
			tr.attr('data-fn', data[i].firstName);
			tr.attr('data-ln', data[i].lastName);
			tr.attr('data-un', data[i].userName);
		var tdFn = $('<td>').html(data[i].firstName);
		var tdLn = $('<td>').html(data[i].lastName);
		var tdUn = $('<td>').html(data[i].userName);

			tr.append(tdLn);
			tr.append(tdFn);
			tr.append(tdUn);

			$('#userTable').append(tr);

	}

};
//============
$('#editUsers').on('click', function(){

	//ajax get method to get user data from DB
	$.ajax({url: currentUrl + '/getUsers', method: 'GET'}).done(function(res){
		trMaker(res);
	});
	// displays panel for editing users
	openUserEditor();

});
//==================================

// switching admin panes through side nav clicks

    // opens edit user panel
function openUserEditor(){

	$('.content-panel').hide();

	$('#editUserPanel').show();

}
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

$('#addUsers').on('click', function(){

	$('.content-panel').hide();
	
	$('#newUserPanel').show();

});

// runs get blog posts onload
getBlogPosts();

//posts new admin data to DB
$('#adminSetsSubmit').on('click', function(){

		var fn = $('#editAdminFn').val().trim();
		var ln = $('#editAdminLn').val().trim();
		var pw = $('#editAdminPw').val().trim();
		var ak = $('#editadminAk').val().trim();
		var color = $('#colorPick').val();
		var id = $('#adminSetsSubmit').attr('data-index');

		$.ajax({
			url: currentUrl + '/setadminsets',
			method: 'POST',
			data: {

				fn: fn,
				ln: ln,
				pw: pw,
				ak: ak,
				id: id,
				color: color

			},
			success: function(res){
		      if(res.status == 1){
		        var timeDelay;

		        $('body').css('background-color', res.color);

		        function showPopover() {
		          $('#adminSetsSubmit').popover('show');

		          timDelay = window.setTimeout(closePopover, 1000);

		        };

		        function closePopover() {

		          $('#adminSetsSubmit').popover('hide');

		          window.clearTimeout(timeDelay);

		          $('#settingsModal').modal('toggle');

		        };

		        showPopover();
		      }
			}
		})


});

// gets settings modal ready
$('#adminSettings').on('click', function(){

	$.ajax({url: currentUrl + '/getadminsets', method: 'GET'}).done(function(res){

		$('#editAdminFn').val(res.firstName);
		$('#editAdminLn').val(res.lastName);
		$('#editAdminPw').val(res.password);
		$('#editadminAk').val(res.authKey);
		$('#colorPick').val(res.bgcolor);
		$('#adminSetsSubmit').attr('data-index', res._id);

		$('#settingsModal').modal('toggle');

	});

});

function intialInfo() {
	$.ajax({url: currentUrl + '/initAdmin', method: 'GET'}).done(function(res){
		$('body').css('background-color', res);
	});
};

intialInfo();

labFetch();
