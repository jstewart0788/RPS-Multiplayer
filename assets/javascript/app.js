

//global variable
var rpsData = new Firebase("https://intense-inferno-5888.firebaseio.com/");

$( document ).ready( function(){
	$("#console").append('\n' +'<br>');
	setInterval(game.checkMovesMade, 500);
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
					loses: 0,
					ties: 0
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
					loses: 0,
					ties: 0
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
	playerLosses: 0,
	playerTies: 0,
	turnOver: false,
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
		$("#playerRecord").text(game.playerName + "'s Record- Wins: " + game.playerWins + " Losses: " + game.playerLosses + " Ties: " + game.playerTies);
	},
	determineWinner: function()
	{
		console.log("Winner being determined!!");
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
		game.progressGame();
		game.playerWins++;
		rpsData.child("players").child(game.playerNumber).update({
				wins: game.playerWins
		});
		addTextToConsole(game.playerName + " has won the game!", true);
	},
	playerLoss: function()
	{
		game.progressGame();
		game.playerLosses++;
		rpsData.child("players").child(game.playerNumber).update({
				loses: game.playerLosses
		});
	},
	playersTie: function()
	{
		game.progressGame();
		game.playerTies++;
		rpsData.child("players").child(game.playerNumber).update({
				ties: game.playerTies
		});
		if (game.playerNumber == 1)
		{
			addTextToConsole("Players have tied the game!", true);
		}
	},
	progressGame: function()
	{
		game.turnOver = true;
	},
	checkMovesMade: function()
	{
			//if both players have made their move evaluate winner
		if(game.playerMoveChosen && game.opponentMoveChosen)
		{
			game.determineWinner();
		}
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

		game.playerMoveChosen = snapshot.child("players").child(game.playerNumber).child("move").exists();
		game.opponentMoveChosen = snapshot.child("players").child(game.opponentNumber).child("move").exists();
	}

	if(game.opponentMoveChosen)
	{
		game.opponentMove = snapshot.child("players").child(game.opponentNumber).child("move").val();
	}

	if(game.turnOver)
	{
		rpsData.child("players").child(game.playerNumber).child("move").remove();
		rpsData.child("players").child(game.opponentNumber).child("move").remove();
		game.playerMove = null;
		game.playerMoveChosen = false;
		game.turnOver = false;
	}

	if(snapshot.child("players").child(game.playerNumber).exists())
	{
		/*
		game.playerWins = snapshot.child("players").child(game.playerNumber).child(wins).val();
		game.playerLosses = snapshot.child("players").child(game.playerNumber).child(loses).val();
		game.playerTies = snapshot.child("players").child(game.playerNumber).child(ties).val();
		*/
		$("#playerRecord").text(game.playerName + "'s Record- Wins: " + game.playerWins + " Losses: " + game.playerLosses + " Ties: " + game.playerTies);
	}

});

rpsData.child("chat").on("child_added", function(childSnapshot, prevChildKey){
	$("#console").append(childSnapshot.val().chatLog);
	var psconsole = $('#console');
    if(psconsole.length)
       psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());

});

