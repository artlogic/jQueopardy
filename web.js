var express = require('express');

var app = express.createServer(express.logger());

app.use(express.static(__dirname + '/public')); 

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Listening on " + port);
    });

// socket.io
var io = require('socket.io');
var socket = io.listen(app);

socket.on('connection', function (client) {
	client.on('message', function (message) {
		console.log('Received message from client!', message);
		client.send(message);
	    });
    });
