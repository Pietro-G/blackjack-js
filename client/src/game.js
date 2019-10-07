var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var deck;
var players;
var currentPlayer = 0;
const humanPlayer = 0;
const computerPlayer = 1;
var ongoing = false;

function createPlayers(num)
{
    //Creates a player and a computer opponent
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        if(i == 1)
        {
            var hand = new Array();
            var player = { Name: 'Player ' + i, ID: i, Score: 0, Hand: hand, bust:false };
            players.push(player);
        }

        else
        {
            var hand = new Array();
            var computer = { Name: 'Computer ', ID: i, Score: 0, Hand: hand, bust:false };
            players.push(computer);
        }
            
    }
}

function createDeck()
{
    deck = new Array();
    for (var i = 0 ; i < values.length; i++)
    {
        for(var x = 0; x < suits.length; x++)
        {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}


function createPlayersUI()
{
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_score = document.createElement('div');

        div_score.className = 'score';
        div_score.id = 'score_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = players[i].Name;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_score);
        document.getElementById('players').appendChild(div_player);
    }
}


//Deal the initial card set up
function dealHands()
{
    for(var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            addCardsUI(card, x);
            updateScore();
        }
    }

    updateDeckUI();
}

function updateDeckUI()
{
    document.getElementById('deckcount').innerHTML = deck.length;
}

//Fisher-Yates stack shuffle
function stackShuffle() {
    let count = deck.length;
    while(count) {
      deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
      count -= 1;
    }
}

function addCardsUI(card, player)
{
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

function startGame()
{

    if (ongoing == false)
    {
        document.getElementById('btnStart').value = "Quit";
        document.getElementById("status").style.display="none";
        currentPlayer = 0;
        createDeck();
        stackShuffle();
        createPlayers(2);
        createPlayersUI();
        dealHands();
        document.getElementById('player_' + currentPlayer).classList.add('active');
        ongoing = true;
    }
    else
    {
        document.getElementById('btnStart').value = "Start";
        document.getElementById('deckcount').innerHTML = 52;
        document.getElementById('players').innerHTML = '';
        document.getElementById('status').innerHTML = 'PlayAgain ?';
        ongoing = false;
    }
}

function getCardUI(card)
{
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'Hearts')
    icon='&hearts;';
    else if (card.Suit == 'Spades')
    icon = '&spades;';
    else if (card.Suit == 'Diamonds')
    icon = '&diams;';
    else
    icon = '&clubs;';
    
    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

// Calculates the score of a player
function calcScore(player)
{
    var score = 0;
    var ace = 0; 
    for(var i = 0; i < players[player].Hand.length; i++)
    {
        if (players[player].Hand[i].Weight == 11) //Count Ace to player advantage
        {
            ace++
        }
        else
        {
            score += players[player].Hand[i].Weight;
        }
        
    }
    
    if(ace > 0)
    {
        for (var z = 0; z < ace; z++)
        {
            if (score > 10)
            {
                score = score + 1;
            }
                
            else
            {
                score = score + 11;
            }
        }       
    }
    

    players[player].Score = score;
    return score;
}

function updateScore()
{
    for (var i = 0 ; i < players.length; i++)
    {
        calcScore(i);
        document.getElementById('score_' + i).innerHTML = players[i].Score;
    }
}

function hitMe()
{
    if(players[currentPlayer].bust == false  && ongoing == true) 
    {
        var card = deck.pop();
        players[currentPlayer].Hand.push(card);
        addCardsUI(card, currentPlayer);
        updateScore();
        updateDeckUI();
        checkGameStatus();
    }
}

function stay()
{
    if (currentPlayer != players.length-1) {
        currentPlayer += 1;

        //Computer Plays as House
        if (currentPlayer == computerPlayer && ongoing == true)
        {
            document.getElementById('player_' + currentPlayer).classList.remove('active');
            document.getElementById('player_' + currentPlayer).classList.add('active');
            computerPlay();
        }
    }
}

function computerPlay()
{
    if (players[humanPlayer].score == players[computerPlayer].score)
    {
        evaluateGame();
    }
    if (players[humanPlayer].Score > players[computerPlayer].Score)
    {

        while (players[humanPlayer].Score > players[computerPlayer].Score && players[computerPlayer].Score < 21)
        {
            var card = deck.pop();
            players[currentPlayer].Hand.push(card);
            addCardsUI(card, currentPlayer);
            updateScore();
            updateDeckUI();
            checkGameStatus();
        }
        evaluateGame();        
    }    
    else
    {
        evaluateGame();
    }    
}

function checkGameStatus()
{
    if (players[currentPlayer].Score > 21)
    {
        players[currentPlayer].bust = true
        document.getElementById('status').innerHTML = players[currentPlayer].Name + ' Bust';
        document.getElementById('status').style.display = 'inline-block';
        document.getElementById('btnStart').value = 'Restart';
        ongoing = false;
    }

    else if (players[currentPlayer].Score == 21)
    {
        document.getElementById('status').innerHTML = players[currentPlayer].Name + ' got BlackJack';
        document.getElementById('status').style.display = 'inline-block';
        document.getElementById('btnStart').value = 'Restart';
        ongoing = false;
    }
    
}

function evaluateGame()
{
    var computerScore = players[computerPlayer].Score;
    var playerScore = players[humanPlayer].Score

    if (computerScore > 21)
    {
        document.getElementById('status').innerHTML = players[currentPlayer].Name + " Bust";
        document.getElementById('status').style.display = "inline-block";
    }
    if (playerScore > computerScore)
    {
        document.getElementById('status').innerHTML = "Player wins";
        document.getElementById('status').style.display = "inline-block";
    }

    if (computerScore > playerScore && computerScore < 22)
    {
        document.getElementById('status').innerHTML = "Computer wins";
        document.getElementById('status').style.display = "inline-block";
    }

    if (playerScore == computerScore)
    {
        document.getElementById('status').innerHTML = " Push";
        document.getElementById('status').style.display = "inline-block";
    }
            
    document.getElementById('btnStart').value = 'Restart';
    ongoing = false;
}

window.addEventListener('load', function(){
    createDeck();
    stackShuffle();
    createPlayers(2);
});