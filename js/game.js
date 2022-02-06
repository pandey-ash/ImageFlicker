var obj = new Game()
var checkTurn = 0;
var currentImg = 0
var compareImg;
var currentImg = null;
var move = 0;
var level = 1;
var check_start_game_call = 0;

/*
This is the class.
*/
function Game()
{
	this.start = start;
	this.createRow = createRow;
	this.createBox = createBox;
	this.insertImg = insertImg;
	this.gameTimer = gameTimer;
	this.startGame = startGame;
	this.pauseGame = pauseGame;
	this.checkHighestScore = checkHighestScore;
	this.displayMsg = displayMsg;
	this.resumeGame = resumeGame;
	this.nextLevel = nextLevel;
}

/*
This function starts the game.
*/
function start(size)
{
	if($(".start").html().indexOf("Play")>-1)
	{
		$(".game-area").css("display", "block");
		obj.createRow(size);
		obj.createBox(size);
		obj.insertImg(size);
		obj.startGame();
		obj.interval = setInterval(gameTimer, 1000);
		obj.gameTimer(obj.interval);
	}
	if(size>4)
	{
		$(".main-div").css("width", "1275px");
	
	}
	$(".start").css("display", "none");
	$("#time").css("display", "inline")
	$(".button").append("<button class='restart' onclick='window.location.reload();'>Restart</button>")
	$(".button").append("<button class='start pause' onclick='obj.pauseGame()'>Pause</button>");
	if(size == "6")
	{
		$(".main-div").css("margin", "40px 138px");
		$(".game-area").css("width", "1218px");
		$(".game-header").css("width", "1218px");
		$(".score").css({"width":"202.3px", "padding":"34px 72px", "margin-right": "42px"});
		$(".time").css({"width":"212.3px", "padding":"34px 72px", "margin-right": "40px"});
		$(".move").css({"width":"280.3px", "padding":"20px 72px"});
		$(".restart").css("margin-left", "532px");
	}
}

/*
This function contain's the main logic of game
*/
function startGame()
{
	$(".box").click(checkForTurn);
	function checkForTurn()
	{
		if(check_start_game_call > 0 && $(this).find("img").hasClass("done"))
		{
			return;
		}
		if(currentImg != null && compareImg.hasClass("done") && currentImg.hasClass("done"))
		{
			compareImg = null;
			currentImg = null;
		}
		else if(compareImg != null && currentImg !=null)
		{
			compareImg.css("opacity", "0");
			currentImg.css("opacity", "0");
		}
		if(checkTurn == 0)
		{
			compareImg = $(this).find("img");
			compareImg.css("opacity", "1");
			currentImg = null;
			checkTurn = 1;
		}
		else
		{
			currentImg = $(this).find("img");
			if(compareImg.attr("id") == currentImg.attr("id"))
			{
				currentImg = null;
				return false;
			}
			if($(this).find("img").attr("src") == compareImg.attr("src") && $(this).find("img").attr("id") !=compareImg.attr("id"))
			{
				$(this).find("img").css("opacity", "1").addClass("done");
				compareImg.addClass("done");
				$("#score").html(parseInt($("#score").html()) + 10).css("display", "inline");
				$(".button").find("img").css("display", "none");
				$('<img src="images/check-mark.png" class="msg-image">').hide().appendTo(".button").fadeIn(1000);
				compareImg.parent().off("click");
				currentImg.parent().off("click");
				checkTurn = 0;
			}
			else
			{
				$(".button").find("img").css("display", "none");
				$('<img src="images/icon.png" class="msg-image">').hide().appendTo(".button").fadeIn(1000);
				$("#move").html(parseInt($("#move").html())+1).css({"display":"inline", "color":"red"});
			}
			currentImg.css("opacity", "1");
			checkTurn = 0;
			if(parseInt($("#move").html()) > parseInt($("#allowed").html()))
			{
				obj.displayMsg("You reached the limit of fail attempt. Your score is "+ $("#score").html());
			}
		}
	}
}

/*
This function perform the pause action.
*/
function pauseGame()
{
	$(".pause").html("Resume").removeAttr("onclick").attr({"class": "resume", "onclick": "obj.resumeGame()"});
	$(".box").off("click");
	clearInterval(obj.interval);
}

/*
This function resume the game after resume button is clicked.
*/
function resumeGame()
{
	$(".resume").html("Pause").removeAttr("onclick").attr({"class": "start pause", "onclick": "obj.pauseGame()"});
	obj.interval = setInterval(gameTimer, 1000);
	++check_start_game_call;
	obj.startGame();
}

/*
This function creates the row depending upon the grid size.
*/
function createRow(size)
{
	for(var i=0; i<size; i++)
	{
		$(".game-area").append("<div class='row'></div>");
		if(i === 0)
		{
			$(".row").addClass("first-row");
		}
	}
}

/*
This function create the div element which contain's the image.
*/
function createBox(size)
{
	for(var i=0; i<size; i++)
	{
		$(".row").append("<div class='box'></div>");
		if(i === (size-1))
		{
			$(".box:nth-child("+size+")").addClass("last-box").after("<div class='clr'></div>");
		}
	}
	$(".box").append("<img />")
}

/*
This function insert image inside each div element.
*/
function insertImg(size)
{
	var img_array = ["apple.png","banana.png","avocado.png","coconut.png","mango.png","pineapple.png","raspberry.png","orange.png","lemon.png","strawberry.png","watermelon.png", "apricot.png","cabbage.png","olives.png","pomegranate.png","guayaba.png","grapes.png","tomato.png"];
	no_array = [];
	for (var i=0; i<size*size; i++)
	{
		no_array.push(i)
	}
	var randomArray = no_array.sort(function() {return .5 - Math.random();});
	for(var i=0, j=0; i<randomArray.length; i++,j++)
	{
		if(i>((size*size)/2)-1)
		{
			j = i-((size*size)/2);
		}
		$("img:eq("+randomArray[i]+")").attr({"src": "images/"+img_array[j], "style": "opacity: 0", "id": randomArray[i]});
	}
}

/*
This function manage the game time.
*/
function gameTimer(interval)
{
	var time = (parseInt($("#time").html())-1);
	if (obj.checkHighestScore(interval))
	{
		return true;
	}
	if(time == "0")
	{
		obj.displayMsg("Time Out !!!!! Your score is: " +$('#score').html());
		clearInterval(obj.interval);
	}
	if(time < 11)
	{
		$("#time").css("color", "red");
	}
	$("#time").html(time);
}

/*
This function checks whether the given score is the highest score or not
*/
function checkHighestScore()
{
	if($("#score").html() == "80")
	{
		clearInterval(obj.interval);
		obj.displayMsg("Congratulations !!! You scored out of. Your score is: " +$('#score').html());
		return true;
	}
}

/*
This function arrange the next level for player.
*/
function nextLevel()
{
	$(".start").css("display", "block");
	$("div, button").not($(".game-header, .score,.time, .main-div,.move, .clr,.button, .game-area, .header,h1")).remove();
	$("#score").html("0").css("display", "none");
	$("#move").html("0").css("display", "none");
	$(".game-area").css("display","none");
	if(level == 2)
	{
		$("#time").html(120).css("display", "none");
		$("#allowed").html("20");
	}
	else if(level == 3)
	{
		$("#time").html(60).css("display", "none");
		$("#allowed").html("25");
	}
	else
	{
		$(".button").append("<h3>Successfully completed game.</h3>");
		$("#time").html("");
		setTimeout(function() { window.location=window.location;},2000);
		return;
	}
	$(".button").append('<button class="start" onclick="obj.start(6)">Play</button>');
}

/*
This function display the score of player.
*/
function displayMsg(msg)
{
	$(".button").find("img").remove();
	$(".game-header").after('<div id="pop-background" class="pop-background" style="display: block"></div>');
	$(".pop-background").after('<div class="lose" id="lose">');
	clearInterval(obj.interval);
	++level;
	for(var i=50; i<=80; i=i+10)
	{
		if(msg.indexOf(i.toString())>-1)
		{
			$(".lose").html(msg).css({"color": "green", "font-size": "22px","display": "block", "text-align": "center"}).append("<br/><button class='refresh' onClick='window.location.reload()'>HOME</button><button class='refresh next-level' onClick='obj.nextLevel()'>NEXT LEVEL</button>");
			$(".game-area").css("display", "none");
			return;
		}
	}
	$(".lose").html(msg).css({"color": "green", "font-size": "22px","display": "block", "text-align": "center"}).append("<br/><button class='refresh' onClick='window.location.reload()'>OK</button>");
	$(".game-area").css("display", "none");
}


$(document).ready(
	function()
	{
		$("body").prepend("<div class='header'></div>");
		$(".header").append("<h1>Image Flicker<h1>");
		$("#score, #time, #move").css("display", "none")
	}
);
