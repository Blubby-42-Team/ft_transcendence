<script lang="ts" setup>

const { screen, player, ball, optionsList, controller, utils, theme } = useGameStore()

const canvasParentId = 'previewCanvasDiv';

function game() {
	if (!document){
		return;
	}
	let ctx = document.querySelector("canvas")?.getContext("2d");
	if (!ctx){
		window.requestAnimationFrame(game);
		return ;
	}
	
	gameGraphics.updateSize(screen, canvasParentId);
	
	{
		utils.value.start = true
		gameEngine.gameTick(optionsList.value, screen);

		if (gameEngine.isGameOver(player.value, optionsList.value)){
			gameEngine.reset(ball, player, optionsList.value);
		}
		gameGraphics.drawGame(ctx, screen.value, theme.value, optionsList.value, player.value, ball.value);
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
	
	gameGraphics.updateSize(screen, canvasParentId);
	gameGraphics.loadTheme(theme.value);
	gameEngine.reset(ball, player, optionsList.value);
	window.requestAnimationFrame(game);
})

</script>

<template>
	<div id="previewCanvasDiv" class="w-full h-full overflow-hidden">
		<client-only placeholder="loading...">
			<canvas class="bg-white border" ref="canvas" :width="screen.width" :height="screen.height"></canvas>
		</client-only>
	</div>
</template>
