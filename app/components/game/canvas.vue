<script lang="ts" setup>

let player1 = 310;
let player2 = 310;
let start = false;
let canvasStart = false;
let page = 0;

let optionsList = {
	maxPoint: 5,
	numPlayer: 2
}

let scores = {
	player1: 0,
	player2: 0
}

let ball = {
	x: 535,
	y: 355,
	dir: Math.PI/6,
	speed: 0
}

let mouse = {
	x: 0,
	y: 0,
}

const moveW = () => {
	player1 -= 20;
	if (player1 < 0) {player1 = 0}
}

const moveS = () => {
	player1 += 20;
	if (player1 > 620) {player1 = 620}
}

const moveUp = () => {
	player2 -= 20;
	if (player2 < 0) {player2 = 0}
}

const moveDown = () => {
	player2 += 20;
	if (player2 > 620) {player2 = 620}
}

let controller = {
	w: {pressed: false, func: moveW},
	s: {pressed: false, func: moveS},
	ArrowUp: {pressed: false, func: moveUp},
	ArrowDown: {pressed: false, func: moveDown}
}

const executeMoves = () => {
	Object.keys(controller).forEach(key=> {
		controller[key].pressed && controller[key].func()
	})
}

const buildBackground = (ctx) => {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.moveTo(0, 0);
	ctx.lineTo(1080, 0);
	ctx.lineTo(0, 720);
	ctx.moveTo(1080, 720);
	ctx.lineTo(0, 720);
	ctx.lineTo(1080, 0);
	ctx.fill();
}

const buildScores = (ctx) => {
	ctx.fillStyle = "gray";
	ctx.font = "100px Arial";
	ctx.fillText(scores.player1.toString() + " - " + scores.player2.toString(), 440, 390); 
}

const buildPlayer = (ctx, x, y) => {
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.moveTo(x, y);
	ctx.lineTo(x + 10, y);
	ctx.lineTo(x, y + 100);

	ctx.moveTo(x + 10, y + 100);
	ctx.lineTo(x, y + 100);
	ctx.lineTo(x + 10, y);
	ctx.fill();
}

const buildBall = (ctx, x, y) => {
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.moveTo(x, y);
	ctx.lineTo(x + 10, y);
	ctx.lineTo(x, y + 10);

	ctx.moveTo(x + 10, y + 10);
	ctx.lineTo(x, y + 10);
	ctx.lineTo(x + 10, y);
	ctx.fill();
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const gameOver = async (ctx) => {
	ctx.fillStyle = "white";
	ctx.font = "100px Arial";
	ctx.fillText("   GAME OVER", 100, 310);
	if (scores.player1 > scores.player2)
		ctx.fillText("   PLAYER 1 WINS!", 100, 410);
	else
		ctx.fillText("   PLAYER 2 WINS!", 100, 410);
	await sleep(3000);
	scores.player1 = 0;
	scores.player2 = 0;
	page = 0;
	window.requestAnimationFrame(menu);
}

const reload = async () => {

	let ctx = document.querySelector("canvas").getContext("2d");
	//fond
	buildBackground(ctx)
	
	//if game over
	if (scores.player1 >= optionsList.maxPoint || scores.player2 >= optionsList.maxPoint) {
		await gameOver(ctx)
		return ;
	}

	//score
	buildScores(ctx)

	//joueurs
	buildPlayer(ctx, 20, player1)
	buildPlayer(ctx, 1050, player2)

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
	if (ball.y > 710) {
		ball.y = 710;
		ball.dir = 2 * Math.PI - ball.dir;
	}
}

const checkCollisionPad = () => {
	if (ball.x < 30) {
		ball.x = 30;
		if (ball.y > player1 && ball.y < player1 + 100) {
			ball.speed++;
			if (ball.y < player1 + 50)
				ball.dir = 0 - ((player1 + 50 - ball.y) / 50 * Math.PI/4)
			else
				ball.dir = (ball.y - (player1 + 50)) / 50 * Math.PI/4
		}
		else {
			ball.x = 535;
			ball.y = 355;
			player1 = 310;
			player2 = 310;
			ball.speed = 0;
			ball.dir = Math.PI * 5 / 6;
			start = false;
			scores.player2++;
			reload();
		}
	}
	if (ball.x > 1040) {
		ball.x = 1040;
		if (ball.y > player2 && ball.y < player2 + 100) {
			ball.speed++;
			if (ball.y < player2 + 50)
				ball.dir = Math.PI + ((player2 + 50 - ball.y) / 50 * Math.PI/4)
			else
				ball.dir = Math.PI - ((ball.y - (player2 + 50)) / 50 * Math.PI/4)
		}
		else {
			ball.x = 535;
			ball.y = 355;
			player1 = 310;
			player2 = 310;
			ball.speed = 0;
			ball.dir = Math.PI / 6;
			start = false;
			scores.player1++;
			reload();
		}
	}
}

document.addEventListener("keydown", (e) => {
	if(controller[e.key]){
		controller[e.key].pressed = true
	}
	if (page === 2 && e.key === "Escape") {
		page = 0;
		window.requestAnimationFrame(menu);
	}
})
document.addEventListener("keyup", (e) => {
	if(controller[e.key]){
		controller[e.key].pressed = false
	}
	if (!start)
		ball.speed = 4;
	start = true;
})

const game = () => {
	if (page === 0)
		window.requestAnimationFrame(menu);
	if (page === 1) {
		executeMoves()
		moveBall();
		checkCollisionWall();
		checkCollisionPad();
		reload();
		if (page === 1)
			window.requestAnimationFrame(game);
	}
}

const buildPongName = (ctx) => {
	ctx.fillStyle = "gray";
	ctx.font = "200px Arial";
	ctx.fillText("PONG", 250, 250);
}

const buildMenuOptions = (ctx) => {
	ctx.font = "50px Arial";

	if (mouse.x > 538 && mouse.x < 698 && mouse.y > 501 && mouse.y < 538)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = "gray";
	ctx.fillText("START", 450, 450);

	if (mouse.x > 510 && mouse.x < 733 && mouse.y > 599 && mouse.y < 639)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = "gray";
	ctx.fillText("OPTIONS", 420, 550);
}

const reloadMenu = () => {
	let ctx = document.querySelector("canvas").getContext("2d");

	//background
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
		ctx.fillStyle = "gray";
	ctx.fillText("X", 1050, 30);
	
	ctx.font = "50px Arial";
	//Nombre de points
	ctx.fillStyle = "gray";
	ctx.fillText("NOMBRE DE POINTS : " + optionsList.maxPoint, 250, 150);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = "gray";
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
		ctx.fillStyle = "gray";
	ctx.beginPath();
	ctx.moveTo(150, 135);
	ctx.lineTo(170, 155);
	ctx.lineTo(190, 135);
	ctx.moveTo(190, 135);
	ctx.lineTo(170, 155);
	ctx.fill();

	//Nombre de joueurs
	ctx.fillStyle = "gray";
	ctx.fillText("NOMBRE DE JOUEURS : " + optionsList.numPlayer, 250, 250);
	if (mouse.x > 234 && mouse.x < 280 && mouse.y > 293 && mouse.y < 311)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = "gray";
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
		ctx.fillStyle = "gray";
	ctx.beginPath();
	ctx.moveTo(150, 235);
	ctx.lineTo(170, 255);
	ctx.lineTo(190, 235);
	ctx.moveTo(190, 235);
	ctx.lineTo(170, 255);
	ctx.fill();
}

const reloadOptions = () => {
	let ctx = document.querySelector("canvas").getContext("2d");

	//background
	buildBackground(ctx);

	//Options template
	buildOptionsTemplate(ctx);
}

const options = () => {
	if (page === 2) {
		reloadOptions();
		window.requestAnimationFrame(options);
	}
}

if (!canvasStart) {
		await sleep(1000);
		canvasStart = true;
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
	if (page === 0 && mouse.x > 510 && mouse.x < 733 && mouse.y > 599 && mouse.y < 639) {
		page = 2;
		window.requestAnimationFrame(options);
	}

	//OPTIONS
	//EXIT
	if (page === 2 && mouse.x > 1138 && mouse.x < 1156 && mouse.y > 94 && mouse.y < 119) {
		page = 0;
		window.requestAnimationFrame(menu);
	}
	//nombre de points up
	if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 190 && mouse.y < 215) {
		optionsList.maxPoint++;
		if (optionsList.maxPoint > 10)
			optionsList.maxPoint = 10;
	}
	//nombre de points down
	if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 221 && mouse.y < 244) {
		optionsList.maxPoint--;
		if (optionsList.maxPoint < 1)
			optionsList.maxPoint = 1;
	}
	//joueurs up
	if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 293 && mouse.y < 311) {
		if (optionsList.numPlayer === 2)
			optionsList.numPlayer = 4;
		else
			optionsList.numPlayer = 2;
	}
	//joueurs down
	if (page === 2 && mouse.x > 234 && mouse.x < 280 && mouse.y > 321 && mouse.y < 343) {
		if (optionsList.numPlayer === 2)
			optionsList.numPlayer = 4;
		else
			optionsList.numPlayer = 2;
	}
}, false);

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
