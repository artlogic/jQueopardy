	var gameBoard = { 
	
		buildTable : function () { 
			var i, j;
			var answer;
			var table = '<table id="jeopardy"><thead><tr>'
		
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
	
			// td click event
			$('td').live('click', function() {
				if ($(this).text() !== 'X') {
					$(this).text('X');
					var qa = gamedata['qadata'][$(this).attr('id')];
					$('#answer').text(qa[0]).show();
					$('#question').text(qa[1]).append('<p><a href="#" id="done" class="button">Done</a></p>');
					$('#detail').fadeIn();
					$('#open').show();
					answer = true;
				}
			});
			
			
			$('#open').click(function() {
				$(this).hide();
				$('#play').show();
				$('#queue').hide();
			});
			$('#correct').click(function() {	
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
			
			$('#link-standby').click(function() {
				$('#standby').toggle();
			});
		
			$('#link-new-board').click(function() {
				$('#new-board').toggle();
			});
			
			$('#link-roster').click(function() {
				$('#roster').toggle();
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
	
	},
	
	readableList = {
		
		buildList : function () { 
			var i, j;
			var answer;
			var $list = $('<dl />');

		
			// build the game table
			for (i = 0; i < gamedata['categories'].length; i++) {
				$list += '<h2>' + gamedata['categories'][i] + '</h2>';
			}
			
	
			
			for (i = 0; i < gamedata['values'].length; i++) {
	
					for (j = 0; j < gamedata['categories'].length; j++) {
						$list += '<dd id="id' + j + 'x' + i + '">' + gamedata['values'][i] + '</dd>';
					}
				
			}
			
			
			$('#readable-list').append($list);
		},
		
		
	}
	
		
		
		
$(function() {	
	
	if ($('#wrapper-game').length > 0) {
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
