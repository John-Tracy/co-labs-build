// grabs current
var currentUrl = window.location.origin;

// on-click for sign-up modal
$('#new-user').on('click', function(){
	$('#signup-modal').modal('toggle');
	return false;
});

// on-click for sending new user info
$('#input-newUser').on('click', function(){
	// grabs password inputs to make sure they match.
	var password = $('#password-signup').val().trim()
	var passwordValid = $('#signup-password-auth').val().trim()

	// makes certain that they are using the password they want to use.
	if(password === passwordValid && password != ''){

		var firstName = $('#firstName-signup').val().trim();
		var lastName = $('#lastName-signup').val().trim();
		var userName = $('#userName-signup').val().trim();
		var authKey = $('#auth-key').val().trim();
		
		$('#signup-modal').modal('toggle');

		$('#auth-key').val('');
		$('#userName-signup').val('');
		$('#lastName-signup').val('');
		$('#firstName-signup').val('');
		$('#signup-password-auth').val('');
		$('#password-signup').val('');



		$.ajax({
			url: currentUrl + '/newUser',
			method: 'POST',
			data: {
				firstName: firstName,
				lastName: lastName,
				userName: userName,
				password: password,
				authKey: authKey
			},
			success: function(response){
				if(response == 'success'){
					$('#sign-success-modal').modal('toggle');
				}
				else if(response == 'invalid'){
					$('#sign-fail-modal').modal('toggle');
				}
			}

		});


		return false;
	}
	else{

		console.log('passwords didnt match');

		return false;
	}
});

//on-click for signing in
$('#user-signin').on('click', function(){
	var userName = $('#inputUserName').val().trim();
	var password = $('#inputPassword').val().trim();

	$('#inputUserName').val('');
	$('#inputPassword').val('');

	if(userName == "admin"){
		$.ajax({
			url: currentUrl + '/adminLogin',
			method: 'POST',
			data: {
				userName: userName,
				password: password				
			},
			success: function(response){
				if(response == 'success'){
					window.location.reload(true);
				}
				else if(response == 'invalid'){

				console.log(response);
				
				}
			}
		});
	}
	else {
		$.ajax({
			url: currentUrl + '/userLogin',
			method: 'POST',
			data: {
				userName: userName,
				password: password
			},
			success: function(response){
				if(response == 'success'){
					window.location.reload(true);
				}
				else if(response == 'invalid-username'){
					//modal
					console.log(response);
				}
				else if(response == 'invalid-password'){
					//modal
					console.log(response);
				}
			}
		});
	}
	
	return false;
});













