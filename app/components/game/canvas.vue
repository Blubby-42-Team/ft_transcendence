<script lang="ts" setup>

let player1 = 310;
let player2 = 310;
let start = false;

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
	ctx.fillStyle = "blue";
	ctx.moveTo(0, 0);
	ctx.lineTo(1080, 0);
	ctx.lineTo(0, 720);
	ctx.moveTo(1080, 720);
	ctx.lineTo(0, 720);
	ctx.lineTo(1080, 0);
	ctx.fill();
}

const buildScores = (ctx) => {
	ctx.fillStyle = "white";
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
}

const reload = async () => {

	let ctx = document.querySelector("canvas").getContext("2d");
	//fond
	buildBackground(ctx)
	
	//if game over
	if (scores.player1 >= 5 || scores.player2 >= 5) {
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
	if (start) {
		executeMoves()
		moveBall();
		checkCollisionWall();
		checkCollisionPad();
		reload();
	}
	window.requestAnimationFrame(game);
}

window.requestAnimationFrame(game);


</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="1080" height="720" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
