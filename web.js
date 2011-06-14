var static = require('node-static'),
    http = require('http'),
    io = require('socket.io'),
    // Create a node-static server instance to serve the './public' folder
    file = new(static.Server)('./public'),
    // port based on environment (if exists)
    port = process.env.PORT || 5000;

// setup static hosting
var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
	// Serve files!
	file.serve(request, response);
    });
})

server.listen(port, function(){
    console.log("Listening on " + port);
});

// socket.io
var socket = io.listen(server);
socket.on('connection', function (client) {
    client.on('message', function (message) {
	console.log('Received message from client!', message);
	client.send(message);
    });
});
