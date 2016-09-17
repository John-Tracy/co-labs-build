// grabs current
var currentUrl = window.location.origin;

// ==================================================
// checks to see if this is new deployment of Co-labs
$.ajax({url: currentUrl + '/check', method: 'GET'}).done(function(res){

	if(res == 'verified'){
		// do nothing
	}
	else if(res == 'new'){
		$('#newAdminModal').modal('toggle');
	}

});
// on click to submit new Administrator info to database
// to begin New Co-labs expirience
$('#input-newAdmin').on('click', function(){

	var fName = $('#firstName-admin').val().trim()
	var lName = $('#lastName-admin').val().trim()
	var pWord = $('#password-admin').val().trim()
	var veriPword = $('#admin-password-auth').val().trim()
	var authKey = $('#new-auth-key').val().trim()
	var veriKey = $('#veri-auth-key').val().trim()

	if(pWord == veriPword && authKey == veriKey){

		$.ajax({
			url: currentUrl + '/newAdmin',
			method: 'POST',
			data: {
				fName: fName,
				lName: lName,
				pWord: pWord,
				authKey: authKey
			},
			success: function(res){
				if(res == 'success'){
					$('#newAdminModal').modal('toggle');
					$('#sign-success-modal').modal('toggle');
				}
			}
		})
	}
	else if(pWord != veriPword || authKey != veriKey){
		$('#didntMatch').modal('toggle');
	}

	

	return false;
});
// ==================================================

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
	var firstName = $('#firstName-signup').val().trim();
	var lastName = $('#lastName-signup').val().trim();
	var userName = $('#userName-signup').val().trim();
	var authKey = $('#auth-key').val().trim();

	// makes certain that they are using the password they want to use.
	if(password === passwordValid && password != '' &&(firstName && lastName != '')){
		
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
				else if(response == 'taken'){
					$('#un-taken').modal('toggle');
				}
			}

		});

		return false;
	}
	else if(password != passwordValid){
		$('#signup-modal').modal('toggle');
		$('#didntMatch').modal('toggle');
	}
	else{
		$('#signup-modal').modal('toggle');
		$('#didntMatch').modal('toggle');
	}

		return false;
	
});

$('.backto').on('click', function(){
	$('#signup-modal').modal('toggle');
	return false;
})

//on-click for signing in
$('#user-signin').on('click', function(){
	var userName = $('#inputUserName').val().trim();
	var password = $('#inputPassword').val().trim();

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

				$('#password-fail-modal').modal('toggle');

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
					$('#username-fail-modal').modal('toggle');
				}
				else if(response == 'invalid-password'){
					//modal
					$('#password-fail-modal').modal('toggle');
				}
			}
		});
	}
	
	return false;
});
