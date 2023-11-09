<script lang="ts" setup>

const { screen, player, ball, optionsList, controller, utils, theme } = useGameStore()

enum gameStatus {
	STARTED,
	GAMEOVER
}

const canvasParentId = 'canvasDiv';
let time = 0;
let status: gameStatus = gameStatus.STARTED;

function game() {
	let ctx = document.querySelector("canvas")?.getContext("2d");
	if (!ctx){
		window.requestAnimationFrame(game);
		return ;
	}
	
	gameGraphics.updateSize(screen, canvasParentId);

	if (status === gameStatus.STARTED){
		gameEngine.gameTick(optionsList.value, screen);

		if (gameEngine.isGameOver(player.value, optionsList.value)){
			status = gameStatus.GAMEOVER;
		}
		gameGraphics.drawGame(ctx, screen.value, theme.value, optionsList.value, player.value, ball.value);
	}
	else if (status === gameStatus.GAMEOVER){
		gameGraphics.drawGameOver(ctx, screen.value, theme.value, player.value);
		time++;
		if (time > 200){
			gameEngine.reset(ball, player, optionsList.value);
			status = gameStatus.STARTED;
			time = 0;
		}
	}

	window.requestAnimationFrame(game);
}

onMounted(() => {	
	document.addEventListener("keydown", (e) => {
		if(controller.value[e.key]){
			controller.value[e.key].pressed = true
		}
	})
	
	document.addEventListener("keyup", (e) => {
		if(controller.value.hasOwnProperty(e.key)){
			controller.value[e.key].pressed = false
		}
		if (e.key === " ") {
			if (!utils.value.start)
				ball.value.speed = 4;
			utils.value.start = true;
		}
	})

	gameGraphics.updateSize(screen, 'canvasDiv');
	gameGraphics.loadTheme(theme.value);
	gameEngine.reset(ball, player, optionsList.value);
	window.requestAnimationFrame(game);
})


</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="screen.width" :height="screen.height" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
