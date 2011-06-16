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
var game1 = require('public/game1'),
    game2 = require('public/game2');

// this is a little silly - makes it easy to cheat - but good enough
// for now
everyone.now.games = {};
everyone.now.games[game1.gameid] = game1.gamedata;
everyone.now.games[game2.gameid] = game2.gamedata;
everyone.now.currentGame = game1.gameid;
everyone.now.currentQuestion = undefined;  // why now?
everyone.now.currentUser = undefined;

// global state
var users = {};
var queue = [];

// utility functions
function clientIdToName(clientId) {
  console.log('clientIdToName', clientId);
  for (var c in users) {
    if (c === clientId) return users[c].name;
  }
}

function nameQueue() {
  console.log('nameQueue');
  var nq = [];
  for (var q = 0; q < queue.length; q++) {
    nq.push(clientIdToName(queue[q]));
  }
  return nq;
}

// player API
everyone.now.login = function(name, fn) {
  console.log('login', name);
  if (clientIdToName(this.user.clientId) === name) {
    fn(false);
  } else {
    users[this.user.clientId] = {'name': name, 'score': 0};
    fn(true);
  }
}

everyone.now.logout = function(fn) {
  console.log('logout');
  delete users[this.user.clientId];
  for (var q = 0; q < queue.length; q++) {
    if (queue[q] === this.user.clientId) {
      queue.splice(q, 1);
      everyone.now.queueChange(nameQueue());
      break;
    }
  }
  fn();
}

everyone.now.answer = function() {
  console.log('answer');
  queue.push(this.user.clientId);
  everyone.now.queueChange(nameQueue());
}

// host API
everyone.now.openForAnswers = function() {
  console.log('openForAnswers');
  everyone.now.stateOpenForAnswers();
}

everyone.now.correct = function() {
  console.log('correct');
  if (queue.length > 0) {
    var qvid = everyone.now.currentQuestion.substring(2, 3);
    var strValue = everyone.now.games[everyone.now.currentGame].values[qvid];
    var value = parseInt(strValue.substring(1));
    var newScore = users[queue[0]].score += value;
    nowjs.getClient(queue[0], function () {
      this.now.updateScore(newScore);  // this might not work
    });
    everyone.now.currentUser = clientIdToName(queue[0]);
    queue = [];
  }
  everyone.now.stateChoose(everyone.now.games[everyone.now.currentGame].qadata[everyone.now.currentQuestion][1]);
}

everyone.now.incorrect = function() {
  console.log('incorrect');
  var qvid = everyone.now.currentQuestion.substring(2, 3);
  var strValue = everyone.now.games[everyone.now.currentGame].values[qvid];
  var value = parseInt(strValue.substring(1));
  var newScore = users[queue[0]].score -= value;
  nowjs.getClient(queue[0], function () {
    this.now.updateScore(newScore);  // this might not work
  });
  queue.shift();
  everyone.now.queueChange(nameQueue());
}

// only called if no one rings in
everyone.now.show = function() {
  console.log('show');
  everyone.now.stateChoose(everyone.now.games[everyone.now.currentGame].qadata[everyone.now.currentQuestion][1]);
}

everyone.now.choose = function(qid) {
  console.log('choose', qid);
  everyone.now.currentQuestion = qid;
  everyone.now.stateChosen(everyone.now.games[everyone.now.currentGame].qadata[qid][0]);
}

everyone.now.roster = function(fn) {
  console.log('roster', this.user.clientId);
  var roster = [];

  for (var u in users) {
    roster.push({name: users[u].name, score: users[u].score});
  }
  roster.sort(function(a, b) { return (b.score - a.score); });

  fn(roster);
}
