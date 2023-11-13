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
	ArrowUp:	(status: boolean) => gameController.move(Direction.RIGHT,	Direction.TOP,		status),
	ArrowDown:	(status: boolean) => gameController.move(Direction.RIGHT,	Direction.BOTTOM,	status),
	c:			(status: boolean) => gameController.move(Direction.BOTTOM,	Direction.LEFT,		status),
	v:			(status: boolean) => gameController.move(Direction.BOTTOM,	Direction.RIGHT,	status),
	u:			(status: boolean) => gameController.move(Direction.TOP,		Direction.LEFT,		status),
	i:			(status: boolean) => gameController.move(Direction.TOP,		Direction.RIGHT,	status),
	' ':		(status: boolean) => gameController.startRound(status),
}

onMounted(() => {
	document.addEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.addEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	gameEngine.start((newState, newGameStatus) => {
		gameState.value = newState;
		gameStatus = newGameStatus;
	})
	
	gameGraphics.start('canvasDiv', theme.value, gameState, (ctx, screen) => {
		screenSize.value.width = screen.width;
		screenSize.value.height = screen.height;
 
		gameGraphics.drawGame(ctx, gameState.value, screen, theme.value);
	})
})

onBeforeRouteLeave(() => {
	document.removeEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.removeEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));

	gameEngine.stop();
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
