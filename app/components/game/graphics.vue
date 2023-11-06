<script lang="js" setup>

import * as canvas from "./canvas.vue"

const buildBackground = () => {
	canvas.ctx.beginPath();
	canvas.ctx.fillStyle = canvas.optionsList.backgroundColor;
	canvas.ctx.moveTo(0, 0);
	canvas.ctx.lineTo(1080, 0);
	canvas.ctx.lineTo(0, 720);
	canvas.ctx.moveTo(1080, 720);
	canvas.ctx.lineTo(0, 720);
	canvas.ctx.lineTo(1080, 0);
	canvas.ctx.fill();
}

const buildScores = () => {
	canvas.ctx.fillStyle = canvas.optionsList.fontColor;
	canvas.ctx.font = "100px Arial";
	canvas.ctx.fillText(canvas.scores.player1.toString() + " - " + canvas.scores.player2.toString(), 440, 390); 

	if (canvas.optionsList.numPlayer === 4) {
		canvas.ctx.fillText(canvas.scores.player3.toString(), 510, 300);
		canvas.ctx.fillText(canvas.scores.player4.toString(), 510, 480);
	}
}

const buildPlayer = (x, y, dir) => {
	if (dir === "vertical") {
		canvas.ctx.beginPath();
		canvas.ctx.fillStyle = canvas.optionsList.assetsColor;
		canvas.ctx.moveTo(x, y);
		canvas.ctx.lineTo(x + 10, y);
		canvas.ctx.lineTo(x, y + canvas.optionsList.padSize);

		canvas.ctx.moveTo(x + 10, y + canvas.optionsList.padSize);
		canvas.ctx.lineTo(x, y + canvas.optionsList.padSize);
		canvas.ctx.lineTo(x + 10, y);
		canvas.ctx.fill();
	}
	else {
		canvas.ctx.beginPath();
		canvas.ctx.fillStyle = canvas.optionsList.assetsColor;
		canvas.ctx.moveTo(x, y);
		canvas.ctx.lineTo(x, y + 10);
		canvas.ctx.lineTo(x + canvas.optionsList.padSize, y);

		canvas.ctx.moveTo(x + canvas.optionsList.padSize, y + 10);
		canvas.ctx.lineTo(x + canvas.optionsList.padSize, y);
		canvas.ctx.lineTo(x, y + 10);
		canvas.ctx.fill();
	}
}

const buildBall = (x, y) => {
	canvas.ctx.beginPath();
	canvas.ctx.fillStyle = canvas.optionsList.assetsColor;
	canvas.ctx.moveTo(x, y);
	canvas.ctx.lineTo(x + canvas.optionsList.ballSize, y);
	canvas.ctx.lineTo(x, y + canvas.optionsList.ballSize);

	canvas.ctx.moveTo(x + canvas.optionsList.ballSize, y + canvas.optionsList.ballSize);
	canvas.ctx.lineTo(x, y + canvas.optionsList.ballSize);
	canvas.ctx.lineTo(x + canvas.optionsList.ballSize, y);
	canvas.ctx.fill();
}

</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="1080" height="720" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
