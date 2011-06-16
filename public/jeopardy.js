var init = false;
var answer = false;
var name;
	var gameBoard = { 
	
		buildTable : function () { 
		  var i, j;
		  var answer;
		  var table = '<table id="jeopardy"><thead><tr>'
		  var gamedata = games[now.currentGame];
		
			// build the game table
			for (i = 0; i < gamedata['categories'].length; i++) {
				table += '<th>' + gamedata['categories'][i] + '</th>';
			}
			table += '</tr></thead><tbody>';
			
			for (i = 0; i < gamedata['values'].length; i++) {
				table += '<tr>';
					for (j = 0; j < gamedata['categories'].length; j++) {
						table += '<td id="id' + j + 'x' + i + '">' + gamedata['values'][i] + '</td>';
					}
				table += '</tr>';
			}
			table += '</tbody></table>';
			
			$('#game').append(table);
		},
		
		clickEvents : function () {
		  var gamedata = games[now.currentGame];

			// td click event
			$('td').live('click', function() {
				if ($(this).text() !== 'X') {
					$(this).text('X');
					var qa = gamedata['qadata'][$(this).attr('id')];
				  now.choose($(this).attr('id'));
					$('#answer').text(qa[0]).show();
					$('#question').text(qa[1]).append('<p><a href="#" id="done" class="button">Done</a></p>');
					$('#detail').fadeIn();
					$('#open').show();
					answer = true;
				}
			});
			
			
			$('#open').click(function() {
			  $('#name').html('Waiting...');
			  now.openForAnswers();
				$(this).hide();
				$('#play').show();
			});
			$('#correct').click(function() {
			  now.incorrect();
			});
			$('#correct').click(function() {
			  now.correct();
				$('#play').hide();
				$('#answer').hide();
				$('#question').show();
				answer = false;
			});
			$('#no-queue').click(function() {
			  now.show();
				$('#play').hide();
				$('#answer').hide();
				$('#question').show();
				answer = false;
			});
			$('#done').live('click', function() {
				$('#detail').hide();
				$('#question').hide();
				answer = true;		
				
				$(this).remove();
			});
					
			$('#link-new-board').click(function() {
				$('#new-board').toggle();
			});
			
			$('#link-roster').toggle(function() {
			  $('#roster').show();
			  now.roster(function(roster) {
			    var html = '<table><tr><td>Name</td><td>Score</td></tr>'
			    for (var i = 0; i < roster.length; i++) {
			      html += '<tr><td>' + roster[i].name + '</td><td>$' + roster[i].score + '</td></tr>';
			    }
			    html += '</table>';
			    $('#roster').html(html);
			  });
			}, function() {
			  $('#roster').hide();
			  $('#roster').html('<p>Loading roster...</p>');
			});
		}
	}, 
				

	mobile = {
		
		hideDivs : function () {
			$('#wrapper-mobile').find('div').hide();
//			$('#sign-in').show();
		},
		
		clickEvents : function () {
			$('#sign-in-form').submit(function(e) {
			  e.preventDefault();
			  name = $('#name').val();
			  now.login(name, function(loggedIn) {
			    if (loggedIn === true) {
			      $('.name').html(name);
			      mobile.hideDivs();
			      $('#control').hide();
			      $('#board-control').show();
			    } else {
			      alert('Name already taken.');
			    }
			  });				
			});
			
			$('#try-again-form').submit(function(e) {
				e.preventDefault();
				$('#try-again').hide();
				$('#standing-by').show();
	
			});
		
			$('#answer-form').submit(function(e) {
			  e.preventDefault();
			  now.answer();
			  mobile.hideDivs();
			  $('#in-line').show();					
			});

		  $('#logout').click(function() {
		    now.logout(function() {
		      location.reload(true);
		    });
		  });
		}
	
	};
		
now.ready(function() {	
	if ($('#wrapper-game').length > 0 && !init) {
	  now.queueChange = function(queue) {
	    console.log('queue change', queue);
	    $('#name').html(queue[0]);
	  };

	  // fake methods so things don't fall apart
	  now.stateOpenForAnswers = function() { console.log('stateOpenForAnswers'); };
	  now.updateScore = function(s) { console.log('updateScore', s); };
	  now.stateChoose = function(q) { console.log('stateChoose', q); };
	  now.stateChosen = function(a) { console.log('stateChosen', a); };

	  gameBoard.buildTable();
	  gameBoard.clickEvents();
	  init = true;
	}
	
	if ($('#wrapper-mobile').length > 0 && !init) {
	  now.queueChange = function(queue) {
	    console.log('queue change', queue);

	    if (name === queue[0]) {
	      mobile.hideDivs();
	      $('#your-up').show();
	    }
	  };

	  now.stateOpenForAnswers = function() { 
	    console.log('stateOpenForAnswers'); 
	    $('#go').removeAttr('disabled');
	  };

	  now.updateScore = function(s) {
	    console.log('updateScore', s);
	    $('.score').html(s);
	  };

	  now.stateChoose = function(q) {
	    console.log('stateChoose', q);
	    if (name === now.currentUser) {
	      $('#control').show();
	    } else {
	      $('#control').hide();
	    }

	    $('.answer-text').html(q);

	    mobile.hideDivs();
	    $('#board-control').show();
	  };

	  now.stateChosen = function(a) { 
	    console.log('stateChosen', a);	    
	    $('#go').attr('disabled', 'disabled');
	    $('.answer-text').html(a);
	    mobile.hideDivs();
	    $('#answer').show()
	  };

	  //comment out mobile.hideDivs() to see all divs
	  mobile.hideDivs();
	  $('#sign-in').show();
	  mobile.clickEvents();
	  init = true;
	}
});
