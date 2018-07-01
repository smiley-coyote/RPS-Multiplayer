// Initialize Firebase
var config = {
  apiKey: "AIzaSyB4GYlrPMMf_gFIyZLmYOY-y4SIBR8IHmk",
  authDomain: "rps-multiplayer-5e7ef.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-5e7ef.firebaseio.com",
  projectId: "rps-multiplayer-5e7ef",
  storageBucket: "rps-multiplayer-5e7ef.appspot.com",
  messagingSenderId: "754178871562"
};
firebase.initializeApp(config);
var database = firebase.database();

var curUser;
var rps = ["rock", "paper", "scissors"];
var userNum = Math.floor(Math.random() * 100000);
var playerSelect = false;

var value;
var player1Name;
var player2Name;
var gameStart = false;
var player1Choice = "";
var player2Choice = "";
var disconnect = firebase.database().ref();
var playerOnline;
var player1Wins = 0;
var player2Wins = 0;
var player1Losses = 0;
var player2Losses = 0;


$(document).ready(function(){
  database.ref().update({
    playerOnline: true
  })
  database.ref("player1/").update({
    rps: ""
  })
  database.ref("player2/").update({
    rps: ""
  })
database.ref().on("value", function(snapshot) {
  
  var seats = parseInt(snapshot.val().seats);
  
  console.log(seats);
  
  
  
  if(curUser !== undefined && seats == 2 && !playerSelect){
    playerSelect = true;
    $("#player1-ID").html("<h2>" + curUser + "</h2>")
    $("#player2-ID").html("<h2>Waiting for player 2 to start...</h2>")
    player1();
   database.ref().update({
     seats: 1
   })
   database.ref().update({
     playerOnline: true
   })
   database.ref("player1/").update({
     name: curUser
   })
   $("#game-start").html("");
   
  } else if (curUser !== undefined && seats == 1 && !playerSelect){
    playerSelect = true;
    player1Name = snapshot.val().player1.name;
    
    $("#player1-box").html("<h2>" + player1Name + " is ready to play</h2>")
    $("#player2-ID").html("<h2>" + curUser + "</h2>")
    player2();
    database.ref().update({
      seats: 0
    })
    database.ref("player2/").update({
      name: curUser
    })
    $("#game-start").html("");
  } else if (!playerSelect && seats == 0){
    playerSelect = true;
    alert("game is full");
    
  } else if (playerSelect && seats == 0){
    player2Name = snapshot.val().player2.name;
    player1Name = snapshot.val().player1.name;
    $("#player2-ID").html("<h1>" + player2Name + "</h1>")

  } 

})

$(document).on("click", "#player-submit", function () {
  event.preventDefault();
  curUser = $("#player-name").val().trim();
  $("#player-input").val("");
 
  database.ref("user/").push({
    player: userNum
  })

});

function player1() {
  for (i = 0; i < rps.length; i++) {
    var newButton = $("<button>" + rps[i] + "</button>");
    newButton.addClass("play-button");
    newButton.attr("id", rps[i])
    newButton.val(rps[i]);
    $("#player1-buttons").append(newButton);
  }
}
function player2() {
  for (i = 0; i < rps.length; i++) {
    var newButton = $("<button>" + rps[i] + "</button>");
    newButton.addClass("play-button");
    newButton.attr("id", rps[i])
    newButton.val(rps[i]);
    $("#player2-buttons").append(newButton);
  }
}

$(document).on("click", ".play-button", function(){
  value = $(this).val();

  if (curUser == player1Name){
    if (value == "rock"){
      player1Choice = "rock";
      database.ref("playerChoice/").update({
        one: player1Choice
      })
      return;
    }
    if (value == "paper"){
      player1Choice = "paper";
      database.ref("playerChoice/").update({
        one: player1Choice
      })
      return;
    }
    if (value == "scissors"){
      player1Choice = "scissors";
      database.ref("playerChoice/").update({
        one: player1Choice
      })
      return;
    }
  }
  if (curUser == player2Name){
    if (value == "rock"){
      player2Choice = "rock";
      database.ref("playerChoice/").update({
        two: player2Choice
      })
      return;
    }
    if (value == "paper"){
      player2Choice = "paper";
      database.ref("playerChoice/").update({
        two: player2Choice
      })
      return;
    }
    if (value == "scissors"){
      player2Choice = "scissors";
      database.ref("playerChoice/").update({
        two: player2Choice
      })
      return;
    }
  }
})

database.ref("playerChoice/").on("value", function(snapshot){
  player1Choice = snapshot.val().one;
  player2Choice = snapshot.val().two;
  if (player1Choice !== "" && player2Choice !== ""){
    
    if (player1Choice == "rock" && player2Choice == "paper"){
      playerOneLose();
    }
    if (player1Choice == "rock" && player2Choice == "scissors"){
      playerOneWin();
    }
    if (player1Choice == "paper" && player2Choice == "rock"){
      playerOneWin();
    }
     if (player1Choice == "paper" && player2Choice == "scissors"){
      playerOneLose();
    }
    if (player1Choice == "scissors" && player2Choice == "rock"){
      playerOneLose();
    }
    if (player1Choice == "scissors" && player2Choice == "paper"){
      playerOneWin();
    }
    if (player1Choice == "scissors" && player2Choice == "scissors"){
      playerTie();
    }
    if (player1Choice == "paper" && player2Choice == "paper"){
      playerTie();
    }
    if (player1Choice == "rock" && player2Choice == "rock"){
      playerTie();
    }

    database.ref("playerChoice/").update({
      one: "",
      two: ""
    })
  }
 
})

database.ref().on("value", function(snapshot){
  playerOnline = snapshot.val().playerOnline;
  var seatsLeft = parseInt(snapshot.val().seats);
  if(playerOnline == false && seatsLeft == 2){
    
      restartGame();
    
  }
})

function playerTie(){
  $("#player1-choice").text(player1Name + " plays " + player1Choice);
  $("#player2-choice").text(player2Name + " plays " + player2Choice);
  $("#results").text("It is a tie!")
}
function playerOneWin(){
  player1Wins++;
  player2Losses++;
  database.ref("player1/").update({
    wins: player1Wins
  })
  database.ref("player2/").update({
    losses: player2Losses
  })
  $("#player1-choice").text(player1Name + " plays " + player1Choice);
  $("#player2-choice").text(player2Name + " plays " + player2Choice);
  $("#results").text(player1Name + " wins!")

  $("#player1-stats").html("<p>Wins: " + player1Wins + " Losses: " + player1Losses)
  $("#player2-stats").html("<p>Wins: " + player2Wins + " Losses: " + player2Losses)
}
function playerOneLose(){
  player1Losses++;
  player2Wins++;
  database.ref("player1/").update({
    losses: player1Losses
  })
  database.ref("player2/").update({
    wins: player2Wins
  })
  $("#player1-choice").text(player1Name + " plays " + player1Choice);
  $("#player2-choice").text(player2Name + " plays " + player2Choice);
  $("#results").text(player2Name + " wins!")
  $("#player1-stats").html("<p>Wins: " + player1Wins + " Losses: " + player1Losses)
  $("#player2-stats").html("<p>Wins: " + player2Wins + " Losses: " + player2Losses)
}



function restartGame() {
      $("#game-start").html("<h2>Player disconnected. Please restart game</h2>")
      $("#player1-ID").html("");
      $("#player1-ID").html("");
      $("#player1-box").html("");
      $("#player2-box").html("");
      $("#player1-buttons").html("");
      $("#player2-buttons").html("");
      var newButton = $("<button>restart</button>");
      newButton.addClass("restart");
      $("#game-start").append(newButton)
    }


$(document).on("click", ".restart", function(){
  database.ref().update({
    playerOnline: true
  })
  location.reload();
  
})
})

disconnect.onDisconnect().update({
  seats: 2,
  playerOnline: false
})
/*
var counter = 1;

$("#send").click(function () {
    var time = new Date().toLocaleTimeString();
    var message = $("#message-input").val();
    $("#message-input").val('');
    chatroom.push({
        username: curUser,
        message: message,
        time: time
    })

    return false;

});

var chatroom = firebase.database().ref("theHackersChatroom");

chatroom.on('value', function(snapshot){
    updateUI(snapshot.val());
})



*/






/* CHAT===========================================================================================================================
//use newMessage to add a new message to the UI
// isCurUser should be set to true or false
function newMessage(message, username, time) {
  var position;
  if (curUser == username) {
    position = 'left'
  }
  else {
    position = 'right'
  }

  $('.messages > ul').append($("<li class='li-" + position + "'><span class='li-message'>" + message + "</span><span class='li-username'>- " + username + " | " + time + "</span></li>"));
  $(".messages").animate({ scrollTop: $(this)[0].scrollHeight }, 1000);
}

function scrollToBottom() {
  $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, 1000);
}


function updateUI(messages) {
  $('.messages > ul').html('');


  for (var key in messages) {
    var message = messages[key];
    var isCurUser = curUser == message.username;

    newMessage(messages[key].message, messages[key].username, messages[key].time);
  }

  scrollToBottom();
}


*/




// My original code

// var rps = ["rock", "paper", "scissors"];
// var player1 = "";
// var player2 = "";
// var player1Select = false;
// var database = firebase.database();

// $($().on("click", "#player-submit", function () {
//     event.preventDefault();
//     if (!player1Select) {
//         player1 = $("#player-input").val().trim();
//         $("#player-input").val("");
//         player1Select = true;
//         database.ref().push({
//             player1: player1
//         })
//         $("#player-1").html("<h2>Player 1: " + player1 + "</h2>");
//         $("#player").html(" <h2>Player 2:</h2> <h2>Enter your name</h2>")
//     } else {
//         player2 = $("#player-input").val().trim();
//         console.log(player2);
//         $("#player-input").val("");
//         database.ref().push({
//             player2: player2
//         })
//         $("#player-2").html("<h2>Player 2: " + player2 + "</h2>");
//         $("#game-select").html("");
//     }
// })
