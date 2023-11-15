<script lang="ts" setup>
import { gameStatusType } from '#imports';

const { theme, gameSettings } = useGame2Store()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: gameStateType;
const engine = new GameEngine(gameSettings.value, (state) => {
		gameState = state;
		console.log(state);
	},
	(state) => {
		if (state.player_bottom.active){
			state.player_bottom.isBot = true;
		}
		if (state.player_top.active){
			state.player_top.isBot = true;
		}
		if (state.player_left.active){
			state.player_left.isBot = true;
		}
		if (state.player_right.active){
			state.player_right.isBot = true;
		}
	}
);

onMounted(async () => {
	engine.start()

	watch(gameSettings.value, () => engine.restart(gameSettings.value));

	gameGraphics.start('previewCanvasDiv', theme.value, gameState, (ctx, screen) => {
		screenSize.value.width = screen.width;
		screenSize.value.height = screen.height;

		switch (gameState.status) {
			case gameStatusType.GAMEOVER:
				engine.restart(gameSettings.value);
			case gameStatusType.ON_HOLD:
				engine.changeGameStatus(gameStatusType.STARTED);
			case gameStatusType.STARTED:
				gameGraphics.drawGame(ctx, gameState, screen, theme.value);
		}
 	});
})

onBeforeRouteLeave(() => {
	engine.stop();
	gameGraphics.stop();
})

</script>

<template>
	<div id="previewCanvasDiv" class="w-full h-full">
		
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
