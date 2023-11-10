<script lang="ts" setup>
import { gameStatus } from '~/stores/game';

const { screen, player, ball, optionsList, theme, utils, status, move, start, changeGameStatus, reset, setPlayer } = useGameStore()

function game() {
	let ctx = document.querySelector("canvas")?.getContext("2d");
	if (!ctx){
		window.requestAnimationFrame(game);
		return ;
	}
	
	gameGraphics.updateSize(screen, canvasParentId);
	
	switch (status.value){
		case gameStatus.STARTED:
			gameEngine.gameTick(optionsList.value, utils, screen, ball, player);
		
			if (gameEngine.isGameOver(player.value, optionsList.value)){
				console.log('')
				reset();
				start();
			}
			gameGraphics.drawGame(ctx, screen.value, theme.value, optionsList.value, player.value, ball.value);

			break ;
		case gameStatus.ON_HOLD:
		case gameStatus.GAMEOVER:
			changeGameStatus(gameStatus.STARTED);
			start();
			break ;
	}

	window.requestAnimationFrame(game);
}

const canvasParentId = 'canvasDiv';

setPlayer(PlayerPosition.LEFT, true, true);
setPlayer(PlayerPosition.RIGHT, true, true);

onMounted(() => {
	gameGraphics.updateSize(screen, canvasParentId);
	gameGraphics.loadTheme(theme.value);
	reset();
	start();
	window.requestAnimationFrame(game);
})

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screen.width" :height="screen.height"></canvas>
		</client-only>
	</div>
</template>
