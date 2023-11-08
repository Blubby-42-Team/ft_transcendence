<script setup lang="ts">

const { optionsList, screen, players, activePlayer, ball } = useGameStore()

onMounted(() => {
	let oldOptions = {
		maxPoint: optionsList.value.maxPoint,
		numPlayer: optionsList.value.numPlayer,
		randomizer: optionsList.value.randomizer,
		padSize: optionsList.value.padSize,
		ballSize: optionsList.value.ballSize,
	}

	function startLoop() {
		players.value.first = 360 - optionsList.value.padSize/2;
		players.value.second = 360 - optionsList.value.padSize/2;
		players.value.third = 540 - optionsList.value.padSize/2;
		players.value.forth = 540 - optionsList.value.padSize/2;

		ball.value.x = 540 - optionsList.value.ballSize/2;
		ball.value.y = 360 - optionsList.value.ballSize/2;
		ball.value.dir = Math.PI/6;
		ball.value.speed = 4;
	}

	function refreshSize () {
		if (document.getElementById('previewCanvasDiv')?.offsetHeight >= 720/1080 * document.getElementById('previewCanvasDiv')?.offsetWidth) {
			screen.value.width = document.getElementById('previewCanvasDiv')?.offsetWidth * 0.98;
			screen.value.height = screen.value.width * 720/1080;
		}
		else {
			screen.value.height = document.getElementById('previewCanvasDiv')?.offsetHeight * 0.98;
			screen.value.width = screen.value.height * 1080/720;
		}
	}

	function reload () {
		let ctx = document.querySelector("canvas").getContext("2d");
		//background
		gameGraphics.buildBackground(ctx);
		//joueurs
		if (optionsList.value.numPlayer === 1 || optionsList.value.numPlayer === 2) {
			gameGraphics.buildPlayer(ctx, 20, players.value.first, "vertical");
			gameGraphics.buildPlayer(ctx, 1050, players.value.second, "vertical");
		}
		else if (optionsList.value.numPlayer === 4) {
			if (activePlayer.value.left)
				gameGraphics.buildPlayer(ctx, 20, players.value.first, "vertical");
			if (activePlayer.value.right)
				gameGraphics.buildPlayer(ctx, 1050, players.value.second, "vertical");
			if (activePlayer.value.top)
				gameGraphics.buildPlayer(ctx, players.value.third, 20, "horizontal");
			if (activePlayer.value.bottom)
				gameGraphics.buildPlayer(ctx, players.value.forth, 690, "horizontal");
		}
		//ball
		gameGraphics.buildBall(ctx, ball.value.x, ball.value.y)
	}

	function checkOption () {
		if (optionsList.value.maxPoint !== oldOptions.maxPoint
			|| optionsList.value.randomizer !== oldOptions.randomizer
			|| optionsList.value.numPlayer !== oldOptions.numPlayer
			|| ((optionsList.value.padSize !== oldOptions.padSize
				|| optionsList.value.ballSize !== oldOptions.ballSize)
				&& !optionsList.value.randomizer)) {
			startLoop();
			oldOptions = optionsList.value;
		}
	}

	function preview () {
		refreshSize();
		checkOption();
		if (!ball.value.speed)
			ball.value.speed = 4;
		screen.value.preview = true;
		gameEngine.moveBall();
		gameController.moveIA();
		gameController.moveIASec();
		gameEngine.checkCollisionWall();
		gameEngine.checkCollisionPad();
		reload();
		window.requestAnimationFrame(preview)
	}

	startLoop();
	window.requestAnimationFrame(preview);
})

</script>

<template>
	<div id="previewCanvasDiv" class="w-full h-full overflow-hidden">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="screen.width" :height="screen.height" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
