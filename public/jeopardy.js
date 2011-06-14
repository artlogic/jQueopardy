$(function() {
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

    // detail click event
	/*
    $('#detail').click(function() {
	if (answer) {
	    $('#answer').hide();
	    $('#question').fadeIn();
	    answer = false;
	} else {
	    $('#detail').fadeOut();
	    $('#question').hide();
	    answer = true;
	}
    });
	*/
	
	
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
	
	$('#link-queue').toggle(function() {
		  $('#queue').show();
		}, function() {
		  $('#queue').hide();
	});	
	
	$('#link-standby').toggle(function() {
			  $('#standby').show();
			}, function() {
			  $('#standby').hide();
		});
	$('#link-new-board').toggle(function() {
			  $('#new-board').show();
			}, function() {
			  $('#new-board').hide();
		});
	$('#link-roster').toggle(function() {
			  $('#roster').show();
			}, function() {
			  $('#roster').hide();
		});			
	
					
	

});
