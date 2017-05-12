var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname));
users = [];
connections = [];

server.listen(3000);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data) {
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	// Send a message
	socket.on('send message', function(data) {
		io.sockets.emit('new message', {
			msg: data,
			user: socket.username
		});
	});

	// New user
	socket.on('new user', function(data, callback) {
		if(users.indexOf(data) > -1){
			socket.emit('userExists', data + ' username is taken! Try another username.');
		}
		else{
			callback(true);
			socket.username = data;
			users.push(socket.username);
			updateUsernames();

			}
	});

	function updateUsernames() {
		io.sockets.emit('get users', users)
	}
})
