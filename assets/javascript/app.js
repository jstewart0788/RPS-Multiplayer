
//global variable
var rpsData = new Firebase("https://intense-inferno-5888.firebaseio.com/");

$(document).on('click', '.inputButton', function(){
	if (game.state == 0) 
	{
		if(game.players == 0)
		{
			game.currentPlayer = 1;
			game.players++;

		}
		else
		{
			game.currentPlayer = 2;
			game.players++;
			game.state++;

		}
	}
	else
	{

	}
});

$("#submitText").on("click",function(){
	var textInput = $("#consoleInput").val().trim();
	addTextToConsole(textInput);
});


function addTextToConsole(text)
{
	$("#console").append(text + '\n' +'<br>');
	var psconsole = $('#console');
    if(psconsole.length)
       psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
}

var game = {
	//state 0 for player selection, 1 for game in progress
	state:0,
	players: 0,
	currentPlayer: 0,
	player1Move: "",
	player2Move: "",
	player1MoveChosen: false,
	player2MoveChosen: false,
	player1Wins: 0,
	player2Wins: 0,
	ties: 0
};