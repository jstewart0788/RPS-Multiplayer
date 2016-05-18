

//global variable
var rpsData = new Firebase("https://intense-inferno-5888.firebaseio.com/");

$( document ).ready( function(){
$("#console").append('\n' +'<br>');
} );


/*
$(document).on('click', '.inputButton', function(){

});
*/

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
	playerNumber: 0,
	player1Move: null,
	player2Move: null,
	player1MoveChosen: false,
	player2MoveChosen: false,
	player1Wins: 0,
	player2Wins: 0,
	player1Losses: 0,
	player2Losses: 0,
	imageArray:["rock","paper","scissors"],
	joinGame: function(){
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

});

rpsData.child("chat").on("child_added", function(childSnapshot, prevChildKey){
	$("#console").append(childSnapshot.val().chatLog);
	var psconsole = $('#console');
    if(psconsole.length)
       psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());

});

