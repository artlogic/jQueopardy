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

// game data
require.paths.unshift('.');
var game1 = require('game1'),
    game2 = require('game2');

// this is a little silly - makes it easy to cheat - but good enough
// for now
everyone.now.games = {};
everyone.now.games[game1.gameid] = game1.gamedata;
everyone.now.games[game2.gameid] = game2.gamedata;
everyone.now.currentGame = game1.gameid;
everyone.now.currentQuestion = undefined;
everyone.now.currentUser = undefined;

// global state
var users = {};
var queue = [];
var hostClientId;  // might not need this
var standbyMsg = "Please stand by.";
var controlUser;

// might not need these
// Possible states:
// 0 = Category Choice
// 1 = Display "Answer"
// 2 = Answerable
// 3 = Display "Question"
// 4 = Stand By
var state = 4  // default to standby


// utility functions
function clientIdToName(clientId) {
  for (var c in users) {
    if (c === clientId) return users[c].name;
  }
}

function nameQueue() {
  var nq = [];
  for (var q = 0; q < queue.length; q++) {
    nq.push(clientIdToName(queue[q]));
  }
  return nq;
}

// player API
everyone.now.login = function(name, fn) {
  if (clientIdToName(this.user.clientId) === name) {
    fn(false);
  } else {
    users[this.user.clientId] = {'name': name, 'score': 0};
    fn(true);
  }
}

everyone.now.logout = function(fn) {
  delete users[this.user.clientId];
  for (var q = 0; q < queue.length; q++) {
    if (queue[q] === this.user.clientId) {
      queue.splice(q, 1);
      break;
    }
  }
  fn();
}

// normally state changes are broadcast to all players, however the
// player may request a state update after login
everyone.now.sendState = function(fn) {
  // TODO: decide what data to call fn with
}

everyone.now.answer = function() {
  queue.push(this.user.clientId);
  everyone.now.queueChange(nameQueue());
}

// host API
everyone.now.openForAnswers = function() {
  everyone.now.stateOpenForAnswers();
}

everyone.now.correct = function() {
  everyone.now.stateChoose();
}

everyone.now.incorrect = function() {
}

// only called if no one rings in
everyone.now.show = function() {
  everyone.now.stateChoose();
}

everyone.now.choose = function(qid) {
  everyone.now.stateChosen(games[currentGameId].gamedata.qadata[qid][0]);
}

everyone.now.standby = function(msg) {
  standbyMsg = msg;
  everyone.now.stateStandby(msg);
}

// might not need this
everyone.now.hostId = function() {
  // some security here might be in order
  hostClientId = this.user.clientId;
}

everyone.now.roster = function() {
}
