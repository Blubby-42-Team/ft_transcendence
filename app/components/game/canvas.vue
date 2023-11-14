<script lang="ts" setup>
import { gameStatusType } from '#imports';
import { getNewStateWithGameSettings } from '~/utils/getNewStateWithGameSettings';


const { theme } = useGame2Store()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: Ref<gameStateType> = ref(getNewStateWithGameSettings());
let gameStatus: gameStatusType = gameStatusType.ON_HOLD;

const emptyFunction = (status: boolean) => {};
const controller: {[key: string]: (status: boolean) => void} = {
	w:			(status: boolean) => gameController.move(Direction.LEFT,	Direction.TOP,		status),
	s:			(status: boolean) => gameController.move(Direction.LEFT,	Direction.BOTTOM,	status),
	' ':		(status: boolean) => gameController.startRound(status),
}

const { stop } = await gameEngine.start((newState, newGameStatus) => {
	console.log(newGameStatus)
	gameState.value = newState;
	gameStatus = newGameStatus;
})

onMounted(async () => {
	document.addEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.addEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	gameGraphics.start('canvasDiv', theme.value, gameState, (ctx, screen) => {
		screenSize.value.width = screen.width;
		screenSize.value.height = screen.height;

		switch (gameStatus) {
			case gameStatusType.ON_HOLD:
			case gameStatusType.STARTED:
				gameGraphics.drawGame(ctx, gameState.value, screen, theme.value);
				break ;
			case gameStatusType.GAMEOVER:
				gameGraphics.drawGameOver(ctx, screen, theme.value, 1);
				break ;
		}
 	})
})

onBeforeRouteLeave(() => {
	document.removeEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.removeEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));

	stop();
	gameGraphics.stop();
})

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
