<script lang="ts" setup>

let player1 = 260;
let player2 = 260;
let start = false;

let ball = {
	x: 535,
	y: 305,
	dir: Math.PI/6,
	speed: 0
}

const moveW = () => {
	player1 -= 20;
	if (player1 < 0) {player1 = 0}
}

const moveS = () => {
	player1 += 20;
	if (player1 > 520) {player1 = 520}
}

const moveUp = () => {
	player2 -= 20;
	if (player2 < 0) {player2 = 0}
}

const moveDown = () => {
	player2 += 20;
	if (player2 > 520) {player2 = 520}
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

const reload = () => {

	let ctx = document.querySelector("canvas").getContext("2d");
	//fond
	buildBackground(ctx)

	//score

	//joueurs
	buildPlayer(ctx, 20, player1 + 100)
	buildPlayer(ctx, 1050, player2 + 100)

	//ball
	buildBall(ctx, ball.x, ball.y + 100)
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
	if (ball.y > 610) {
		ball.y = 610;
		ball.dir = 2 * Math.PI - ball.dir;
	}
}

const checkCollisionPad = () => {
	if (ball.x < 30) {
		ball.x = 30;
		if (ball.y > player1 && ball.y < player1 + 100) {
			ball.speed += 2;
			ball.dir = Math.PI - ball.dir;
		}
		else {
			ball.x = 535;
			ball.y = 305;
			ball.speed = 0;
			ball.dir = Math.PI * 5 / 6;
			start = false;
		}
	}
	if (ball.x > 1040) {
		ball.x = 1040;
		if (ball.y > player2 && ball.y < player2 + 100) {
			ball.speed += 2;
			ball.dir = Math.PI - ball.dir;
		}
		else {
			ball.x = 535;
			ball.y = 305;
			ball.speed = 0;
			ball.dir = Math.PI / 6;
			start = false;
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
	executeMoves()
	moveBall();
	checkCollisionWall();
	checkCollisionPad();
	if (start)
		reload();
	window.requestAnimationFrame(game);
}

window.requestAnimationFrame(game);


</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="1080" height="720" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
