// on-click for sign-up modal
$('#new-user').on('click', function(){
	$('#signup-modal').modal('toggle');
	return false;
});

// on-click for sending new user info
$('#input-newUser').on('click', function(){
	var password = $('#password-signup').val().trim()
	var passwordValid = $('#signup-password-auth').val().trim()
	console.log(password);
	console.log(passwordValid);
	// makes certain that they are using the password they want to use.
	if(password === passwordValid && password != ''){

		console.log('password validation worked');
		// var firstName
		// var lastName
		// var userName
		// var password
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
		console.log('admin ajax');
	}
	else {
		console.log('user ajax');
	}
	
	return false;
});













