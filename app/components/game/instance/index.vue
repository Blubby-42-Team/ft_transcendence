<script lang="ts" setup>
import { gameStatusType } from '#imports';

const { theme, gameSettings } = useGameStore()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: any = {};

const engine = new GameEngine(gameSettings.value, (state) => {
	gameState = state;
});

const emptyFunction = (status: boolean) => {};
const controller: gameControllerType = {
	w:			(status: boolean) => engine.move(Direction.LEFT,	true,	status),
	s:			(status: boolean) => engine.move(Direction.LEFT,	false,	status),
	ArrowUp:	(status: boolean) => engine.move(Direction.RIGHT,	true,	status),
	ArrowDown:	(status: boolean) => engine.move(Direction.RIGHT,	false,	status),
	c:			(status: boolean) => engine.move(Direction.BOTTOM,	true,	status),
	v:			(status: boolean) => engine.move(Direction.BOTTOM,	false,	status),
	u:			(status: boolean) => engine.move(Direction.TOP,		true,	status),
	i:			(status: boolean) => engine.move(Direction.TOP,		false,	status),
	' ':		(status: boolean) => engine.startRound(status),
}

const graphic = new GraphicEngine('canvasDiv', theme.value, () => gameState, (ctx, screen) => {
	screenSize.value.width = screen.width;
	screenSize.value.height = screen.height;
	
	switch (gameState.status) {
		case gameStatusType.ON_HOLD:
		case gameStatusType.STARTED:
			graphic.drawGame(ctx);
			break ;
		case gameStatusType.GAMEOVER:
			graphic.drawGameOver(ctx, 1);
			break ;
	}
});

onMounted(async () => {
	document.addEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.addEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	engine.start()
	graphic.start();
})

onUnmounted(() => {
	document.removeEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.removeEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	engine.stop();
	graphic.stop();
})

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="border bg-text border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
