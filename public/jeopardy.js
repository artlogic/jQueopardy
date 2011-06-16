var answer = false;
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
				  now.choose(qa);
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
			$('#sign-in').show();
		},
		
		clickEvents : function () {
			$('#sign-in-form').submit(function(e) {
				e.preventDefault();
				$('#sign-in').hide();
				$('#standing-by').show();
				
				//or if already used $('#try-again').show();
			});
			
			$('#try-again-form').submit(function(e) {
				e.preventDefault();
				$('#try-again').hide();
				$('#standing-by').show();
	
			});
			
		
			//whole div click
			$('#answer').click(function(){
				$('#answer').hide();
				$('#your-up').show();				
			});
			
			$('#answer-form').submit(function(e) {
				e.preventDefault();
				$('#answer').hide();
				$('#your-up').show();
	
			});
		}
	
	};
		
now.ready(function() {	
	if ($('#wrapper-game').length > 0) {
	  now.queueChange = function(queue) {
	    console.log('queue change', queue);
	    $('#name').html(queue[0]);
	  }
		gameBoard.buildTable();
		gameBoard.clickEvents();
	}
	
	if ($('#wrapper-mobile').length > 0) {
		//comment out mobile.hideDivs() to see all divs
		mobile.hideDivs();
		mobile.clickEvents();
	}
	
	if ($('#wrapper-list').length > 0) {
		readableList.buildList();
		
	}	
});
