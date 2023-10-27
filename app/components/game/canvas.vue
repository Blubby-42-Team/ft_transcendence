<script lang="ts" setup>

let player1 = 40;
let player2 = 40;

game();

function buildPlayer (ctx, x, y) {
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.moveTo(x, y);
	ctx.lineTo(x + 10, y);
	ctx.lineTo(x, y + 120);

	ctx.moveTo(x + 10, y + 120);
	ctx.lineTo(x, y + 120);
	ctx.lineTo(x + 10, y);
	ctx.fill();
}

function reload (ctx) {

	//fond
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.moveTo(0, 0);
	ctx.lineTo(1080, 0);
	ctx.lineTo(0, 720);
	ctx.moveTo(1080, 720);
	ctx.lineTo(0, 720);
	ctx.lineTo(1080, 0);
	ctx.fill();

	//score

	//joueurs
	buildPlayer(ctx, 20, player1 * 6 + 100)
	buildPlayer(ctx, 1050, player2 * 6 + 100)	
}

document.addEventListener('keydown', function(event) {
	if (event.key === "w") { w = true }
	if (event.key === "s") { s = true }
	if (event.key === "ArrowUp") { up = true }
	if (event.key === "ArrowDown") { down = true }
});

document.addEventListener('keyup', function(event) {
	if (event.key === "w") { w = false }
	if (event.key === "s") { s = false }
	if (event.key === "ArrowUp") { up = false }
	if (event.key === "ArrowDown") { down = false }
});

function game () {
	let w = false, s = false, up = false, down = false
	while (true) {
		if (w) {
			player1 -= 2;
			if (player1 < 0) {player1 = 0}
		}
		if (s) {
			player1 += 2;
			if (player1 > 80) {player1 = 80}
		}
		if (up) {
			player2 -= 2;
			if (player2 < 0) {player2 = 0}
		}
		if (down) {
			player2 += 2;
			if (player2 > 80) {player2 = 80}
		}
		player1 = player1
		player2 = player2
		let ctx = document.querySelector("canvas").getContext("2d");
		console.log(player1)
		reload(ctx)
	}
};


</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="1080" height="720" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
