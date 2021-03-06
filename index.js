$(function() {
	var socket = io.connect();
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $chat = $('#chat');
	var $messageArea = $('#messageArea');
	var $userFormArea = $('#userFormArea');
	var $userForm = $('#userForm');
	var $users = $('#users');
	var $username = $('#username');
	var $errorContainer = $('#errorContainer');
	var $chatBox = $('#chatBox');

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit('send message', $message.val());
		$message.val('');
	});

	socket.on('new message', function(data) {
		$chat.append('<div class="well well-sm"><strong>' + data.user + ': </strong>' + data.msg + '</div>');
		$chatBox.scrollTop($chatBox.prop('scrollHeight'));
	})

	$userForm.submit(function(e) {
		e.preventDefault();
		socket.emit('new user', $username.val(), function(data) {
			if(data) { 
				$userFormArea.hide();
				$messageArea.show();
			}
		})
		$username.val('');
	})

	socket.on('userExists', function(data){
		$errorContainer.text(data);
	}); 

	socket.on('get users', function(data) {
		var html = '';
		for(i = 0; i < data.length; i++) {
			html += '<li class="list-group-item">' + data[i] + '</li>'
					}
		$users.html(html);
	})
})