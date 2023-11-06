<script lang="ts" setup>

let start = false;
let canvasStart = false;
let page = 0;
let time = 0;
let delay = 200;

let optionsList = {
	maxPoint: 5,
	numPlayer: 2,
	ballSize: 15,
	padSize: 100,
	theme: "dark mode",
	backgroundColor: "black",
	fontColor: "gray",
	assetsColor: "white"
}

let player1 = 360 - optionsList.padSize/2;
let player2 = 360 - optionsList.padSize/2;
let player3 = 540 - optionsList.padSize/2;
let player4 = 540 - optionsList.padSize/2;

let scores = {
	player1: 0,
	player2: 0,
	player3: 0,
	player4: 0
}

let activePlayer = {
	top: false,
	bottom: false,
	left: true,
	right: true
}

let ball = {
	x: 540 - optionsList.ballSize/2,
	y: 360 - optionsList.ballSize/2,
	dir: Math.PI/6,
	speed: 0
}

let mouse = {
	x: 0,
	y: 0
}

const moveW = () => {
	player1 -= 20;
	if (player1 < 0) {player1 = 0}
}

const moveS = () => {
	player1 += 20;
	if (player1 > 720 - optionsList.padSize) {player1 = 720 - optionsList.padSize}
}

const moveUp = () => {
	player2 -= 20;
	if (player2 < 0) {player2 = 0}
}

const moveDown = () => {
	player2 += 20;
	if (player2 > 720 - optionsList.padSize) {player2 = 720 - optionsList.padSize}
}

const moveC = () => {
	player4 -= 30;
	if (player4 < 0) {player4 = 0}
}

const moveV = () => {
	player4 += 30;
	if (player4 > 1080 - optionsList.padSize) {player4 = 1080 - optionsList.padSize}
}

const moveU = () => {
	player3 -= 30;
	if (player3 < 0) {player3 = 0}
}

const moveI = () => {
	player3 += 30;
	if (player3 > 1080 - optionsList.padSize) {player3 = 1080 - optionsList.padSize}
}

let controller = {
	w: {pressed: false, func: moveW},
	s: {pressed: false, func: moveS},
	ArrowUp: {pressed: false, func: moveUp},
	ArrowDown: {pressed: false, func: moveDown},
	c: {pressed: false, func: moveC},
	v: {pressed: false, func: moveV},
	u: {pressed: false, func: moveU},
	i: {pressed: false, func: moveI}
}

const executeMoves = () => {
	Object.keys(controller).forEach(key=> {
		controller[key].pressed && controller[key].func()
	})
}

const buildBackground = (ctx) => {
	ctx.beginPath();
	ctx.fillStyle = optionsList.backgroundColor;
	ctx.moveTo(0, 0);
	ctx.lineTo(1080, 0);
	ctx.lineTo(0, 720);
	ctx.moveTo(1080, 720);
	ctx.lineTo(0, 720);
	ctx.lineTo(1080, 0);
	ctx.fill();
}

const buildScores = (ctx) => {
	ctx.fillStyle = optionsList.fontColor;
	ctx.font = "100px Arial";
	ctx.fillText(scores.player1.toString() + " - " + scores.player2.toString(), 440, 390); 

	if (optionsList.numPlayer === 4) {
		ctx.fillText(scores.player3.toString(), 510, 300);
		ctx.fillText(scores.player4.toString(), 510, 480);
	}
}

const buildPlayer = (ctx, x, y, dir) => {
	if (dir === "vertical") {
		ctx.beginPath();
		ctx.fillStyle = optionsList.assetsColor;
		ctx.moveTo(x, y);
		ctx.lineTo(x + 10, y);
		ctx.lineTo(x, y + optionsList.padSize);

		ctx.moveTo(x + 10, y + optionsList.padSize);
		ctx.lineTo(x, y + optionsList.padSize);
		ctx.lineTo(x + 10, y);
		ctx.fill();
	}
	else {
		ctx.beginPath();
		ctx.fillStyle = optionsList.assetsColor;
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + 10);
		ctx.lineTo(x + optionsList.padSize, y);

		ctx.moveTo(x + optionsList.padSize, y + 10);
		ctx.lineTo(x + optionsList.padSize, y);
		ctx.lineTo(x, y + 10);
		ctx.fill();
	}
}

const buildBall = (ctx, x, y) => {
	ctx.beginPath();
	ctx.fillStyle = optionsList.assetsColor;
	ctx.moveTo(x, y);
	ctx.lineTo(x + optionsList.ballSize, y);
	ctx.lineTo(x, y + optionsList.ballSize);

	ctx.moveTo(x + optionsList.ballSize, y + optionsList.ballSize);
	ctx.lineTo(x, y + optionsList.ballSize);
	ctx.lineTo(x + optionsList.ballSize, y);
	ctx.fill();
}

const sleep = () => {
	if (time < delay)
		time++;
	else {
		page = 0;
		scores.player1 = 0;
		scores.player2 = 0;
		scores.player3 = 0;
		scores.player4 = 0;
		time = 0;
		window.requestAnimationFrame(menu);
	}
}

const gameOver = (ctx) => {
	ctx.fillStyle = optionsList.assetsColor;
	ctx.font = "100px Arial";
	ctx.fillText("   GAME OVER", 100, 310);
	if (scores.player1 > scores.player2 && scores.player1 > scores.player3 && scores.player1 > scores.player4)
		ctx.fillText("   PLAYER 1 WINS!", 100, 410);
	else if (scores.player2 > scores.player1 && scores.player2 > scores.player3 && scores.player2 > scores.player4)
		ctx.fillText("   PLAYER 2 WINS!", 100, 410);
	else if (scores.player3 > scores.player1 && scores.player3 > scores.player2 && scores.player3 > scores.player4)
		ctx.fillText("   PLAYER 3 WINS!", 100, 410);
	else
		ctx.fillText("   PLAYER 4 WINS!", 100, 410);
	window.requestAnimationFrame(sleep);
}

const reload = () => {

	let ctx = document.querySelector("canvas").getContext("2d");
	//fond
	buildBackground(ctx)
	
	//if game over
	if (scores.player1 >= optionsList.maxPoint || scores.player2 >= optionsList.maxPoint || scores.player3 >= optionsList.maxPoint || scores.player4 >= optionsList.maxPoint) {
		gameOver(ctx)
		return ;
	}

	//score
	buildScores(ctx)

	//joueurs
	if (optionsList.numPlayer === 2) {
		buildPlayer(ctx, 20, player1, "vertical");
		buildPlayer(ctx, 1050, player2, "vertical");
	}
	else if (optionsList.numPlayer === 4) {
		if (activePlayer.left)
			buildPlayer(ctx, 20, player1, "vertical");
		if (activePlayer.right)
			buildPlayer(ctx, 1050, player2, "vertical");
		if (activePlayer.top)
			buildPlayer(ctx, player3, 20, "horizontal");
		if (activePlayer.bottom)
			buildPlayer(ctx, player4, 690, "horizontal");
	}

	//ball
	buildBall(ctx, ball.x, ball.y)
}

const moveBall = () => {
	ball.x += ball.speed * Math.cos(ball.dir);
	ball.y += ball.speed * Math.sin(ball.dir);
}

const checkCollisionWall = () => {
	if (ball.y < 0) {
		ball.y = 0;
		ball.dir = 2 * Math.PI - ball.dir;
	}
	if (ball.y > 720 - optionsList.ballSize) {
		ball.y = 720 - optionsList.ballSize;
		ball.dir = 2 * Math.PI - ball.dir;
	}
}

const resetPlay = () => {
	ball.x = 540 - optionsList.ballSize/2;
	ball.y = 360 - optionsList.ballSize/2;
	player1 = 360 - optionsList.padSize/2;
	player2 = 360 - optionsList.padSize/2;
	player3 = 540 - optionsList.padSize/2;
	player4 = 540 - optionsList.padSize/2;
	ball.speed = 0;
	start = false;
	reload();
}

const checkCollisionPad = () => {
	if (ball.x < 30) {
		ball.x = 30;
		if (ball.y + optionsList.ballSize > player1 && ball.y < player1 + optionsList.padSize) {
			ball.speed++;
			if (ball.y + optionsList.ballSize/2 < player1 + optionsList.padSize/2) {
				ball.dir = 0 - ((player1 + optionsList.padSize/2 - ball.y) / optionsList.padSize/2 * Math.PI/4)
				if (ball.dir < - Math.PI/4)
					ball.dir = - Math.PI/4;
			}
			else {
				ball.dir = (ball.y - (player1 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI/4
				if (ball.dir > Math.PI/4)
					ball.dir = Math.PI/4;
			}
		}
		else {
			scores.player2++;
			ball.dir = Math.PI * 5 / 6;
			resetPlay();
		}
	}
	if (ball.x > 1050 - optionsList.ballSize) {
		ball.x = 1050 - optionsList.ballSize;
		if (ball.y + optionsList.ballSize > player2 && ball.y < player2 + optionsList.padSize) {
			ball.speed++;
			if (ball.y + optionsList.ballSize/2 < player2 + optionsList.padSize/2) {
				ball.dir = Math.PI + ((player2 + optionsList.padSize/2 - ball.y) / optionsList.padSize/2 * Math.PI/4)
				if (ball.dir > Math.PI * 5/4)
					ball.dir = Math.PI * 5/4;
			}
			else {
				ball.dir = Math.PI - ((ball.y - (player2 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI/4)
				if (ball.dir < Math.PI * 3/4)
					ball.dir = Math.PI * 3/4;
			}
		}
		else {
			scores.player1++;
			ball.dir = Math.PI / 6;
			resetPlay();
		}
	}
}


const CollisionPadLeft = () => {
	ball.x = 30;
	if (ball.y + optionsList.ballSize > player1 && ball.y < player1 + optionsList.padSize) {
		ball.speed++;
		if (ball.y + optionsList.ballSize/2 < player1 + optionsList.padSize/2) {
			ball.dir = 0 - ((player1 + optionsList.padSize/2 - ball.y) / optionsList.padSize/2 * Math.PI/4)
			if (ball.dir < - Math.PI/4)
				ball.dir = - Math.PI/4;
		}
		else {
			ball.dir = (ball.y - (player1 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI/4
			if (ball.dir > Math.PI/4)
				ball.dir = Math.PI/4;
		}
	}
	else {
		activePlayer.left = false;
		ball.dir = Math.PI * 5 / 6;
		resetPlay();
	}
}

const CollisionPadRight = () => {
	ball.x = 1050 - optionsList.ballSize;
	if (ball.y + optionsList.ballSize > player2 && ball.y < player2 + optionsList.padSize) {
		ball.speed++;
		if (ball.y + optionsList.ballSize/2 < player2 + optionsList.padSize/2) {
			ball.dir = Math.PI + ((player2 + optionsList.padSize/2 - ball.y) / optionsList.padSize/2 * Math.PI/4)
			if (ball.dir > Math.PI * 5/4)
				ball.dir = Math.PI * 5/4;
		}
		else {
			ball.dir = Math.PI - ((ball.y - (player2 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI/4)
			if (ball.dir < Math.PI * 3/4)
				ball.dir = Math.PI * 3/4;
		}
	}
	else {
		activePlayer.right = false;
		ball.dir = Math.PI / 6;
		resetPlay();
	}
}

const CollisionPadTop = () => {
	ball.y = 30;
	if (ball.x + optionsList.ballSize > player3 && ball.x < player3 + optionsList.padSize) {
		ball.speed++;
		if (ball.x + optionsList.ballSize/2 < player3 + optionsList.padSize/2) {
			ball.dir = 0 - ((player3 + optionsList.padSize/2 - ball.x) / optionsList.padSize/2 * Math.PI * 3/4)
			if (ball.dir > Math.PI * 3/4)
				ball.dir = Math.PI * 3/4;
		}
		else {
			ball.dir = (ball.x - (player3 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI * 3/4
			if (ball.dir < Math.PI / 4)
				ball.dir = Math.PI / 4;
		}
	}
	else {
		activePlayer.top = false;
		ball.dir = Math.PI * 8 / 6;
		resetPlay();
	}
}

const CollisionPadBottom = () => {
	ball.y = 690 - optionsList.ballSize;
	if (ball.x + optionsList.ballSize > player4 && ball.x < player4 + optionsList.padSize) {
		ball.speed++;
		if (ball.x + optionsList.ballSize/2 < player4 + optionsList.padSize/2) {
			ball.dir = Math.PI * 3/2 - ((player4 + optionsList.padSize/2 - ball.x) / optionsList.padSize/2 * Math.PI/4)
			if (ball.dir < Math.PI * 5/4)
				ball.dir = Math.PI * 5/4;
		}
		else {
			ball.dir = Math.PI * 3/2 + ((ball.x - (player4 + optionsList.padSize/2)) / optionsList.padSize/2 * Math.PI * 4)
			if (ball.dir > Math.PI * 7 / 4)
				ball.dir = Math.PI * 7 / 4;
		}
	}
	else {
		activePlayer.bottom = false;
		ball.dir = Math.PI * 4 / 6;
		resetPlay();
	}
}

const checkCollisionPadActive = () => {
	//GAUCHE
	if (ball.x < 30 && activePlayer.left)
		CollisionPadLeft();
	else if (ball.x < 0 && !activePlayer.left) {
		ball.x = 0;
		ball.dir = Math.PI - ball.dir;
	}
	//DROITE
	if (ball.x > 1050 - optionsList.ballSize && activePlayer.right)
		CollisionPadRight();
	else if (ball.x > 1080 - optionsList.ballSize && !activePlayer.right) {
		ball.x = 1080 - optionsList.ballSize;
		ball.dir = Math.PI - ball.dir;
	}
	//HAUT
	if (ball.y < 30 && activePlayer.top)
		CollisionPadTop();
	else if (ball.y < 0 && !activePlayer.top) {
		ball.y = 0;
		ball.dir = 2 * Math.PI - ball.dir;
	}
	//BAS
	if (ball.y > 690 - optionsList.ballSize && activePlayer.bottom)
		CollisionPadBottom();
	else if (ball.y > 720 - optionsList.ballSize && !activePlayer.bottom) {
		ball.y = 720 - optionsList.ballSize;
		ball.dir = 2 * Math.PI - ball.dir;
	}
}

const checkEndPlay = () => {
	let numPlayerActive = 0;
	if (activePlayer.top)
		numPlayerActive++;
	if (activePlayer.bottom)
		numPlayerActive++;
	if (activePlayer.left)
		numPlayerActive++;
	if (activePlayer.right)
		numPlayerActive++;
	if (numPlayerActive < 2) {
		if (activePlayer.top)
			scores.player3++;
		if (activePlayer.bottom)
			scores.player4++;
		if (activePlayer.left)
			scores.player1++;
		if (activePlayer.right)
			scores.player2++;
		activePlayer.top = true;
		activePlayer.bottom = true;
		activePlayer.left = true;
		activePlayer.right = true;
	}
}

const game = () => {
	if (page === 0)
		window.requestAnimationFrame(menu);
	if (page === 1) {
		executeMoves()
		moveBall();
		if (optionsList.numPlayer === 2) {
			checkCollisionWall();
			checkCollisionPad();
		}
		else {
			checkCollisionPadActive();
			checkEndPlay();
		}
		reload();
		if (page === 1)
			window.requestAnimationFrame(game);
	}
}

const buildPongName = (ctx) => {
	ctx.fillStyle = optionsList.fontColor;
	ctx.font = "200px Arial";
	ctx.fillText("PONG", 250, 250);
}

const buildMenuOptions = (ctx) => {
	ctx.font = "50px Arial";

	if (mouse.x > 538 && mouse.x < 698 && mouse.y > 501 && mouse.y < 538)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("START", 450, 450);

	if (mouse.x > 510 && mouse.x < 733 && mouse.y > 599 && mouse.y < 639)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("OPTIONS", 420, 550);
}

const reloadMenu = () => {
	let ctx = document.querySelector("canvas").getContext("2d");

	//background``
	buildBackground(ctx);

	//PONG
	buildPongName(ctx);

	//text + over
	buildMenuOptions(ctx);
}

const menu = () => {
	if (page === 0) {
		reloadMenu();
		window.requestAnimationFrame(menu);
	}
}

const buildOptionsTemplate = (ctx) => {
	ctx.font = "30px Arial";

	//EXIT
	if (mouse.x > 1138 && mouse.x < 1156 && mouse.y > 94 && mouse.y < 119)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("X", 1050, 30);
	
	ctx.font = "50px Arial";
	//Nombre de points
	ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("NOMBRE DE POINTS : " + optionsList.maxPoint, 250, 150);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 125);
	ctx.lineTo(170, 105);
	ctx.lineTo(190, 125);
	ctx.moveTo(190, 125);
	ctx.lineTo(170, 105);
	ctx.fill();
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 221 && mouse.y < 244)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 135);
	ctx.lineTo(170, 155);
	ctx.lineTo(190, 135);
	ctx.moveTo(190, 135);
	ctx.lineTo(170, 155);
	ctx.fill();

	//Nombre de joueurs
	ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("NOMBRE DE JOUEURS : " + optionsList.numPlayer, 250, 250);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 293 && mouse.y < 311)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 225);
	ctx.lineTo(170, 205);
	ctx.lineTo(190, 225);
	ctx.moveTo(190, 225);
	ctx.lineTo(170, 205);
	ctx.fill();
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 321 && mouse.y < 343)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 235);
	ctx.lineTo(170, 255);
	ctx.lineTo(190, 235);
	ctx.moveTo(190, 235);
	ctx.lineTo(170, 255);
	ctx.fill();

	//Ball size
	ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("TAILLE DE LA BALLE : " + optionsList.ballSize/10 + 'x', 250, 350);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 391 && mouse.y < 414)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 325);
	ctx.lineTo(170, 305);
	ctx.lineTo(190, 325);
	ctx.moveTo(190, 325);
	ctx.lineTo(170, 305);
	ctx.fill();
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 422 && mouse.y < 446)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 335);
	ctx.lineTo(170, 355);
	ctx.lineTo(190, 335);
	ctx.moveTo(190, 335);
	ctx.lineTo(170, 355);
	ctx.fill();

	//Pad size
	ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("TAILLE DES PAD : " + optionsList.padSize/100 + 'x', 250, 450);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 491 && mouse.y < 514)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 425);
	ctx.lineTo(170, 405);
	ctx.lineTo(190, 425);
	ctx.moveTo(190, 425);
	ctx.lineTo(170, 405);
	ctx.fill();
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 522 && mouse.y < 546)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 435);
	ctx.lineTo(170, 455);
	ctx.lineTo(190, 435);
	ctx.moveTo(190, 435);
	ctx.lineTo(170, 455);
	ctx.fill();

	//Suivant
	if (mouse.x > 595 && mouse.x < 661 && mouse.y > 640 && mouse.y < 700)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(510, 550);
	ctx.lineTo(510, 600);
	ctx.lineTo(570, 575);
	ctx.moveTo(570, 575);
	ctx.lineTo(510, 600);
	ctx.fill();
}

const buildOptionsTemplate2 = (ctx) => {
	ctx.font = "30px Arial";

	//EXIT
	if (mouse.x > 1138 && mouse.x < 1156 && mouse.y > 94 && mouse.y < 119)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("X", 1050, 30);
	
	ctx.font = "50px Arial";

	//Theme
	ctx.fillStyle = optionsList.fontColor;
	ctx.fillText("THEME : " + optionsList.theme, 250, 150);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 125);
	ctx.lineTo(170, 105);
	ctx.lineTo(190, 125);
	ctx.moveTo(190, 125);
	ctx.lineTo(170, 105);
	ctx.fill();
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 221 && mouse.y < 244)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 135);
	ctx.lineTo(170, 155);
	ctx.lineTo(190, 135);
	ctx.moveTo(190, 135);
	ctx.lineTo(170, 155);
	ctx.fill();

	//Précédent
	if (mouse.x > 595 && mouse.x < 661 && mouse.y > 640 && mouse.y < 700)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.fontColor;
	ctx.beginPath();
	ctx.moveTo(570, 550);
	ctx.lineTo(570, 600);
	ctx.lineTo(510, 575);
	ctx.moveTo(510, 575);
	ctx.lineTo(570, 600);
	ctx.fill();
}

const reloadOptions = () => {
	let ctx = document.querySelector("canvas").getContext("2d");

	//background
	buildBackground(ctx);

	//Options template
	if (page === 2)
		buildOptionsTemplate(ctx);
	else if (page === 3)
		buildOptionsTemplate2(ctx);
}

const options = () => {
	if (page === 2 || page === 3) {
		reloadOptions();
		window.requestAnimationFrame(options);
	}
}

var canvas = document.getElementById("canvas");

//report the mouse position on click
document.addEventListener("click", function (evt) {
	//MENU
	//click sur start
	if (page === 0 && mouse.x > 538 && mouse.x < 698 && mouse.y > 501 && mouse.y < 538) {
		page = 1;
		window.requestAnimationFrame(game);
	}
	//click sur option
	else if (page === 0 && mouse.x > 510 && mouse.x < 733 && mouse.y > 599 && mouse.y < 639) {
		page = 2;
		window.requestAnimationFrame(options);
	}

	//OPTIONS
	//exit
	else if ((page === 2 || page === 3) && mouse.x > 1138 && mouse.x < 1156 && mouse.y > 94 && mouse.y < 119) {
		page = 0;
		window.requestAnimationFrame(menu);
	}
	//nombre de points up
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215) {
		optionsList.maxPoint++;
		if (optionsList.maxPoint > 10)
			optionsList.maxPoint = 10;
	}
	//nombre de points down
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 221 && mouse.y < 244) {
		optionsList.maxPoint--;
		if (optionsList.maxPoint < 1)
			optionsList.maxPoint = 1;
	}
	//joueurs up
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 293 && mouse.y < 311) {
		if (optionsList.numPlayer === 2) {
			activePlayer.bottom = true;
			activePlayer.top = true;
			activePlayer.left = true;
			activePlayer.right = true;
			optionsList.numPlayer = 4;
		}
		else
			optionsList.numPlayer = 2;
	}
	//joueurs down
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 321 && mouse.y < 343) {
		if (optionsList.numPlayer === 2) {
			activePlayer.bottom = true;
			activePlayer.top = true;
			activePlayer.left = true;
			activePlayer.right = true;
			optionsList.numPlayer = 4;
		}
		else
			optionsList.numPlayer = 2;
	}
	//ball up
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 391 && mouse.y < 414) {
		optionsList.ballSize += 5;
		if (optionsList.ballSize > 50)
			optionsList.ballSize = 50;
	}
	//ball down
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 422 && mouse.y < 446) {
		optionsList.ballSize -= 5;
		if (optionsList.ballSize < 10)
			optionsList.ballSize = 10;
	}
	//pad up
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 491 && mouse.y < 514) {
		optionsList.padSize += 50;
		if (optionsList.padSize > 300)
			optionsList.padSize = 300;
	}
	//pad down
	else if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 522 && mouse.y < 546) {
		optionsList.padSize -= 50;
		if (optionsList.padSize < 50)
			optionsList.padSize = 50;
	}
	//page suivante
	else if (page === 2 && mouse.x > 595 && mouse.x < 661 && mouse.y > 640 && mouse.y < 700)
		page = 3;
	//page precedente
	else if (page === 3 && mouse.x > 595 && mouse.x < 661 && mouse.y > 640 && mouse.y < 700)
		page = 2;
	//theme up
	else if (page === 3 && mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215) {
		if (optionsList.theme === "dark mode") {
			optionsList.theme = "white mode";
			optionsList.backgroundColor = "white";
			optionsList.assetsColor = "black";
		}
		else {
			optionsList.theme = "dark mode";
			optionsList.backgroundColor = "black";
			optionsList.assetsColor = "gray";
		}
	}
	//theme down
	else if (page === 3 && mouse.x > 234 && mouse.x < 280 && mouse.y > 221 && mouse.y < 244) {
		if (optionsList.theme === "dark mode") {
			optionsList.theme = "white mode";
			optionsList.backgroundColor = "white";
			optionsList.assetsColor = "black";
		}
		else {
			optionsList.theme = "dark mode";
			optionsList.backgroundColor = "black";
			optionsList.assetsColor = "gray";
		}
	}
}, false);

//Key pressed
document.addEventListener("keydown", (e) => {
	if(controller[e.key]){
		controller[e.key].pressed = true
	}
	if ((page === 2 || page === 3) && e.key === "Escape") {
		page = 0;
		window.requestAnimationFrame(menu);
	}
})

//Key released
document.addEventListener("keyup", (e) => {
	if(controller[e.key]){
		controller[e.key].pressed = false
	}
	if (e.key === " ") {
		if (!start)
			ball.speed = 4;
		start = true;
	}
})

//Get Mouse Position
document.addEventListener("mousemove", function(e) { 
	mouse.x = Math.round(e.clientX);
	mouse.y = Math.round(e.clientY);
	//console.log(mouse.x + " " + mouse.y);
});

window.requestAnimationFrame(menu);


</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="1080" height="720" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
