var gameStarted = false;

var rightPressed = false;
var leftPressed = false;

var score;

var nrlives;

var lives = ['rgb(172, 212, 239)', 'rgb(25, 111, 61)'];

var lives2 = ['rgb(126, 111, 183)', 'rgb(57, 7, 61)', 'rgb(2, 28, 45)', 'rgb(210, 34, 112)'];

var ball = [];
ball.x = 0;
ball.y = 0;
ball.speedX = 0;
ball.speedY = 0;
ball.diametr = 16;
ball.speed = 3;

var platform = [];
platform.x = 0;
platform.y = 0;
platform.width = 100;
platform.height = 10;

var brick = [];
brick.height = 20;
brick.width = 30;

const widthDiv = 600;
const heightDiv = 400;
var coordtForBricks = [179, 214, 249, 284, 319, 354, 389];

var countToGenerate = 4;
var tempCount = 0;
var gamedifficulty;


/*functions for level-difficulty-choice*/
/*-------------------------------------*/
$("#easy").click(function () {
    gamedifficulty = 'easy';
    startGame();
});

$("#hard").click(function () {
    gamedifficulty = 'hard';
    startGame();
});
/*-------------------------------------*/


function disableBtn() {
    document.getElementById("hard").disabled = true;
    document.getElementById("easy").disabled = true;
    $("#easy").blur();
    $("#hard").blur();
}
/*-------------------------------------*/

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function addBrick(x, y, health) {
    var brickVal = $('<div class="brick"></div>');
    $(brickVal).appendTo("#fieldGame");

    $('.brick')[$('.brick').length - 1].style.top = y + 'px';
    $('.brick')[$('.brick').length - 1].style.left = x + 'px';
    $('.brick')[$('.brick').length - 1].style.width = brick.width + 'px';
    $('.brick')[$('.brick').length - 1].style.height = brick.height + 'px';
    $('.brick').eq($('.brick').length - 1).css('background-color', lives[health]);
    if (gamedifficulty === 'hard') {
        $('.brick').eq($('.brick').length - 1).css('background-color', lives2[health]);
    }
}
/*-------------------------------------*/

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/*function for generating the random order of bricks in a row*/
/*------------------------------------------------*/
function generate() {
    var list = $(".brick");
    for (var i = 0; i < list.length; i++) {
        list[i].style.top = list[i].offsetTop + 22 + 'px';
    }
    for (var i = 0; i < 7; i++) {
        var tempNumber = getRandomInt(0, lives.length + 1);
        if (tempNumber < lives.length) {
            addBrick(coordtForBricks[i], 5, tempNumber);
        }
    }
}
/*------------------------------------------------*/

function initGame() {
    $('#fieldGame')[0].style.width = widthDiv + 'px';
    $('#fieldGame')[0].style.height = heightDiv + 'px';
    $('#gameBall')[0].style.top = (heightDiv - 50) + 'px';
    $('#gameBall')[0].style.left = (widthDiv / 2 - ball.diametr / 2) + 'px';
    $('#gameBall')[0].style.width = ball.diametr + 'px';
    $('#gameBall')[0].style.height = ball.diametr + 'px';
    $('#userPaddle')[0].style.width = platform.width + 'px';
    $('#userPaddle')[0].style.height = platform.height + 'px';
    $('#userPaddle')[0].style.top = (heightDiv - 20) + 'px';
    $('#userPaddle')[0].style.left = (widthDiv / 2 - platform.width / 2) + 'px';
}
initGame();
/*------------------------------------*/

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
/*--------------------------------------*/


function startGame() {
    if (gamedifficulty === "hard") {
        lives = lives2;
    }
    generate();

    ball.speedY = -ball.speed;
    ball.speedX = 0;
    gameStarted = true;

    ball.x = 300;
    ball.y = 350;
    platform.x = (widthDiv / 2 - platform.width / 2);
    platform.y = (heightDiv - 20);

    score = 0;
    nrlives = 3;
}
/*---------------------------------------*/


$('#btnStart').click(function () {
    location.reload(true);
});


function movePlatform() {
    if (rightPressed && platform.x < widthDiv - 4 - platform.width) {
        platform.x += 4;
    }
    if (leftPressed && platform.x > 0) {
        platform.x -= 4;
    }
}
/*---------------------------------------*/

function restart() {
    ball.speedY = -ball.speed;
    ball.speedX = 0;
    gameStarted = false;

    ball.x = 300;
    ball.y = 350;
}
/*---------------------------------------*/

/*function for distance between coordinates for if statements*/
/*coordinates are used for check statement - if the ball and brick are being crossed*/
/*---------------------------------------*/
function dist(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}
/*---------------------------------------*/


/*function for crossing the ball with the brick*/
/*---------------------------------------*/
function crossing(x1, y1, x2, y2) {
    var bool = (Math.abs(dist(x1, x2, y1, y2)) <= ball.diametr / 2)
    return bool
}
/*---------------------------------------*/

function moveBall() {

    //check when ball hits left or right side
    if (ball.x < ball.diametr / 2 || ball.x > widthDiv - ball.diametr / 2) {
        ball.speedX *= -1;
    }
    //check when ball hits top or bottom side
    if (ball.y < ball.diametr / 2 || ball.y > heightDiv - ball.diametr / 2) {
        ball.speedY *= -1;
    }
    //check if ball is under the platform level
    else if (ball.y > platform.y || ball.y > heightDiv - ball.diametr / 2) {

        nrlives--;
        $("#lifestats").html(nrlives);

        ball.x = 300;
        ball.y = 350;
        ball.speedY = -ball.speed;
        ball.speedX = 0;
        platform.x = (widthDiv / 2 - platform.width / 2);
        platform.y = (heightDiv - 20);

        if (nrlives == 0) {
            setTimeout("restart()", 10);
            $('#exampleModal').modal('toggle');
        }
    }

    /*check for all balls interactions with platform*/
    /*--------------------------------------------*/
    if ((platform.x >= ball.x && platform.y >= ball.y && crossing(ball.x, ball.y, platform.x, platform.y))
        || (platform.x >= ball.x && platform.y <= ball.y && platform.y + platform.height >= ball.y && crossing(ball.x, 0, platform.x, 0))
        || (platform.x >= ball.x && platform.y + platform.height <= ball.y && crossing(ball.x, ball.y, platform.x, platform.y + platform.height))
        || (platform.x <= ball.x && platform.x + platform.width >= ball.x && platform.y >= ball.y && crossing(0, ball.y, 0, platform.y))
        || (platform.x <= ball.x && platform.x + platform.width >= ball.x && platform.y + platform.height <= ball.y && crossing(0, ball.y, 0, platform.y + platform.height))
        || (platform.x + platform.width <= ball.x && platform.y >= ball.y && crossing(ball.x, ball.y, platform.x + platform.width, platform.y))
        || (platform.x + platform.width <= ball.x && platform.y <= ball.y && platform.y + platform.height >= ball.y && crossing(ball.x, 0, platform.x + platform.width, 0))
        || (platform.x + platform.width <= ball.x && platform.y + platform.height <= ball.y && crossing(ball.x, ball.y, platform.x + platform.width, platform.y + platform.height))) {
    /*--------------------------------------------*/
    //check for adding new line of brick
        if (tempCount == countToGenerate) {
            tempCount = 0;
            generate();
        } else {
            tempCount += 1;
        }

      /*formula for calculating the angle for ball direction*/
      /*----------------------------------------------------*/
        var v = (ball.x - ball.diametr / 2 - platform.x) - platform.width / 2;
        var w = (platform.width / 2);
        var k = v / w;
        var k2 = Math.abs(k);
        var y = Math.sqrt((ball.speed * ball.speed / (k2 * k2 + 1)));
        var x = Math.sqrt(ball.speed * ball.speed - y * y);
      /*----------------------------------------------------*/

      /*additional checks for ball direction*/
      /*------------------------------------*/
        ball.speedY = -y;

        if (k > 0) {
            ball.speedX = x;
        }

        else {
            ball.speedX = -x;
            }
      /*------------------------------------*/
    }


    ball.y += ball.speedY;
    ball.x += ball.speedX;
}
/*-----------------------------------------------*/

$('#gameover').click(function () {
    location.reload(true);
});


/*function for making brick disappear or reducing its health*/
/*----------------------------------------------------------*/
function damage(brick) {
    var live;
    live = lives.indexOf(brick.css('background-color'));
    score++;
    $("#pointstats").html(score);
    if (live == 0) {
        $(brick).fadeOut("fast", function () {
            ball.speed += 0.05;
        });
    } else {
        console.log(live);
        brick.css('background-color', lives[live - 1])
    }
}
/*----------------------------------------------------------*/

window.setInterval(function () {
    if (!gameStarted) return;

    movePlatform();

/*checks for all balls interactions with bricks*/
/*-------------------------------------*/
    var list = $(".brick");
    for (var i = 0; i < list.length; i++) {
        var width = list[i].offsetWidth;
        var height = list[i].offsetHeight;
        var top = list[i].offsetTop;
        var left = list[i].offsetLeft;
        if (left >= ball.x && top >= ball.y) {
            if (crossing(ball.x, ball.y, left, top)) {
                ball.speedX = -ball.speed / Math.sqrt(2);
                ball.speedY = -ball.speed / Math.sqrt(2);
                damage(list.eq(i))
            }
        } else if (left >= ball.x && top <= ball.y && top + height >= ball.y) {
            if (crossing(ball.x, 0, left, 0)) {
                ball.speedX *= -1;
                damage(list.eq(i))
            }
        } else if (left >= ball.x && top + height <= ball.y) {
            if (crossing(ball.x, ball.y, left, top + height)) {
                ball.speedX = -ball.speed / Math.sqrt(2);
                ball.speedY = ball.speed / Math.sqrt(2);
                damage(list.eq(i))
            }
        } else if (left <= ball.x && left + width >= ball.x && top >= ball.y) {
            if (crossing(0, ball.y, 0, top)) {
                ball.speedY *= -1;
                damage(list.eq(i))
            }
        } else if (left <= ball.x && left + width >= ball.x && top <= ball.y && top + height >= ball.y) {

            damage(list.eq(i))
        } else if (left <= ball.x && left + width >= ball.x && top + height <= ball.y) {
            if (crossing(0, ball.y, 0, top + height)) {
                ball.speedY *= -1;
                damage(list.eq(i))
            }
        } else if (left + width <= ball.x && top >= ball.y) {
            if (crossing(ball.x, ball.y, left + width, top)) {
                ball.speedX = ball.speed / Math.sqrt(2);
                ball.speedY = -ball.speed / Math.sqrt(2);
                damage(list.eq(i))
            }
        } else if (left + width <= ball.x && top <= ball.y && top + height >= ball.y) {
            if (crossing(ball.x, 0, left + width, 0)) {
                ball.speedX *= -1;
                damage(list.eq(i))
            }
        } else if (left + width <= ball.x && top + height <= ball.y) {
            if (crossing(ball.x, ball.y, left + width, top + height)) {
                ball.speedX = ball.speed / Math.sqrt(2);
                ball.speedY = ball.speed / Math.sqrt(2);
                damage(list.eq(i))
            }
        }
    }
    moveBall();


    $('#gameBall')[0].style.top = ball.y - ball.diametr / 2 + 'px';
    $('#gameBall')[0].style.left = ball.x - ball.diametr / 2 + 'px';
    $('#userPaddle')[0].style.left = platform.x + 'px';
    $('#userPaddle')[0].style.top = platform.y + 'px';

//time in ms for timer-function
}, 15);
