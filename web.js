// module dependencies
var static = require('node-static'),
    http = require('http'),
    nowjs = require('now');

// port based on environment (if exists)
var port = process.env.PORT || 5000;

// setup static hosting
var file = new(static.Server)('./public');
var staticServer = http.createServer(function (request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  });
});

staticServer.listen(port, function() {
    console.log("Listening on " + port);
});

// setup now
var everyone = nowjs.initialize(staticServer);
