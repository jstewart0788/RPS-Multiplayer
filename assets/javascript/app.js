

//global variable
var rpsData = new Firebase("https://intense-inferno-5888.firebaseio.com/");

$( document ).ready( function(){
$("#console").append('\n' +'<br>');
} );


/*
$(document).on('click', '.inputButton', function(){

});
*/

$("#joinGame").on("click",function(){
	var textInput = $("#nameInput").val().trim();
	addTextToConsole("Console: " + textInput + " has joined the game");
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
	if(!game.player1LoggedIn)
	{
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
		alert("maximum number of players reached!");
	}	

	return false;
});

$("#submitText").on("click",function(){
	var textInput = $("#consoleInput").val().trim();
	addTextToConsole(textInput);
	return false;
});


function addTextToConsole(text)
{
	$("#console").append(text + '\n' +'<br>');
	var psconsole = $('#console');
    if(psconsole.length)
       psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
}

var game = {
	player1LoggedIn: false,
	player2LoggedIn: false,
	playerName: "",
	playerNumber: 0,
	player1Move: "",
	player2Move: "",
	player1MoveChosen: false,
	player2MoveChosen: false,
	player1Wins: 0,
	player2Wins: 0,
	player1Losses: 0,
	player2Losses: 0,
	imageArray:["rock","paper","scissors"]
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

