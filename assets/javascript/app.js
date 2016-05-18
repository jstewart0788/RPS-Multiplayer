

//global variable
var rpsData = new Firebase("https://intense-inferno-5888.firebaseio.com/");

$( document ).ready( function(){
$("#console").append('\n' +'<br>');
} );

//Function for joining a game
$("#joinGame").on("click",function(){

	if(!game.player1LoggedIn)
	{
		game.joinGame();
		game.playerNumber=1;
		rpsData.child("players").update({
				1: {
					name: game.playerName,
					wins: 0,
					loses: 0
				}
		});
		rpsData.child("players").child(1).onDisconnect().remove();
	}
	else if(!game.player2LoggedIn)
	{
		game.joinGame();
		game.playerNumber=2;
		rpsData.child("players").update({
				2: {
					name: game.playerName,
					wins: 0,
					loses: 0
				}
		});
		rpsData.child("players").child(2).onDisconnect().remove();
	}
	else
	{		
		var textInput = $("#nameInput").val().trim();
		addTextToConsole(textInput + " has attempted to join the game, but it is full!", true);
		game.playerName = textInput;
	}	

	return false;
});


$(document).on('click', '.inputButton', function(){
	if(game.player1LoggedIn && game.player2LoggedIn)
	{
		game.playerMove = $(this).data("move");
		if(game.playerNumber == 1)
		{		
			rpsData.child("players").child("1").update({
				move: game.playerMove
			});
		}
		if(game.playerNumber == 2)
		{		
			rpsData.child("players").child("2").update({
				move: game.playerMove
			});
		}
	}

});


$("#submitText").on("click",function(){
	var textInput = $("#consoleInput").val().trim();
	$("#consoleInput").val("");
	addTextToConsole(textInput, false);
	return false;
});


function addTextToConsole(text, systemMessage)
{
	if(!systemMessage)
	{
		if(game.playerName == null)
			rpsData.child("chat").push({chatLog: "Guest: " + text + '\n' +'<br>'});
		else
			rpsData.child("chat").push({chatLog: game.playerName+ ": " + text + '\n' +'<br>'});
	}
	else
	{
		rpsData.child("chat").push({chatLog: "Console: " + text + '\n' +'<br>'});
	}
}

var game = {
	player1LoggedIn: false,
	player2LoggedIn: false,
	playerName: null,
	opponentName:null,
	playerNumber: 0,
	opponentNumber: 0,
	playerMove: null,
	opponentMove: null,
	playerMoveChosen: false,
	opponentMoveChosen: false,
	playerWins: 0,
	opponentWins: 0,
	playerLosses: 0,
	opponentLosses: 0,
	imageArray:["rock","paper","scissors"],
	joinGame: function()
	{
		var textInput = $("#nameInput").val().trim();
		addTextToConsole(textInput + " has joined the game", true);
		game.playerName = textInput;
		$("#selectDiv").empty();
		for(var i = 0; i<game.imageArray.length; i++)
		{
			var tempImg = $("<img>");
			$(tempImg).attr("src","assets/images/"+ game.imageArray[i] +".png")
			$(tempImg).attr("class", "inputButton");
			$(tempImg).attr("data-move", game.imageArray[i]);
			$("#selectDiv").append(tempImg);
		}
	},
	determineWinner: function()
	{

		if (game.playerMove == game.opponentMove ) //covers all ties
		{
				game.playersTie();
		}
		else if (game.playerMove == 'rock')// user picks rock
		{
				if(game.opponentMove== 'scissors')
				{
					game.playerWin();
				}
				else
				{
					game.playerLoss();
				}
					
		}
		else if(game.playerMove == 'paper') // user picks paper
		{
			if(game.opponentMove== 'scissors')
			{
					game.playerLoss();
			}
			else
			{
					game.playerWin();
			}
		}
		else	//user picks scissors
		{
			if(game.opponentMove== 'paper')
			{
				game.playerWin();
			}
			else
			{
				game.playerLoss();
			}

		}
	},
	playerWin: function()
	{
		game.playerWins ++;
		rpsData.child("players").child(game.playerNumber).update({
				wins: game.playerWins
		});
		addTextToConsole(game.playerName + " has won the game!", true);
		addTextToConsole(game.playerName + "- Wins: " +game.playerWins + " Loses: " + game.playerLosses , true);
		addTextToConsole(game.opponentName + "- Wins: " +game.opponentWins + " Loses: " + game.opponentLosses , true);
		game.progressGame();
	},
	playerLoss: function()
	{
		game.playerLosses ++;
		rpsData.child("players").child(game.playerNumber).update({
				loses: game.playerLosses
		});
		game.progressGame();
	},
	playersTie: function()
	{
		addTextToConsole("Players have tied the game!", true);
		addTextToConsole(game.playerName + "- Wins: " +game.playerWins + " Loses: " + game.playerLosses , true);
		addTextToConsole(game.opponentName + "- Wins: " +game.opponentWins + " Loses: " + game.opponentLosses , true);
		game.progressGame();
	},
	progressGame: function()
	{
		game.playerMove = null;
		game.playerMoveChosen = false;
		rpsData.child("players").child(game.playerNumber).child("move").remove();

	}
};

rpsData.on("value", function(snapshot) {

	if (!snapshot.child("players").exists())
	{
		rpsData.set({
			chat:"",
			players:""
		});
	}

	game.player1LoggedIn = snapshot.child("players").child("1").exists();

	game.player2LoggedIn = snapshot.child("players").child("2").exists();


	//test if both players have logged in
	if(game.player1LoggedIn && game.player1LoggedIn)
	{
		if(game.playerNumber == 1) game.opponentNumber = 2;

		if(game.playerNumber == 2) game.opponentNumber = 1;

		game.opponentName = snapshot.child("players").child(game.opponentNumber).child("name").val();
		game.opponentWins = snapshot.child("players").child(game.opponentNumber).child("wins").val();
		game.opponentLosses = snapshot.child("players").child(game.opponentNumber).child("loses").val();


		game.playerMoveChosen = snapshot.child("players").child(game.playerNumber).child("move").exists();
		game.opponentMoveChosen = snapshot.child("players").child(game.opponentNumber).child("move").exists();
	}

	//if both players have made their move evaluate winner
	if(game.playerMoveChosen && game.opponentMoveChosen)
	{
		game.opponentMove = snapshot.child("players").child(game.opponentNumber).child("move").val();
		game.determineWinner();
	}

});

rpsData.child("chat").on("child_added", function(childSnapshot, prevChildKey){
	$("#console").append(childSnapshot.val().chatLog);
	var psconsole = $('#console');
    if(psconsole.length)
       psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());

});

