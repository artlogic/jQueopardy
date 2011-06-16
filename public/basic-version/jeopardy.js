$(function() {
    var i, j;
    var answer;
    var table = '<table><thead><tr>'

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
	    $('#question').text(qa[1]);
	    $('#detail').fadeIn();
	    answer = true;
	}
    });

    // detail click event
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
});
