<script lang="ts" setup>
import { gameStatusType } from '#imports';
import { getNewStateWithGameSettings } from '~/utils/getNewStateWithGameSettings';

const { theme, gameSettings } = useGame2Store()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: Ref<gameStateType> = ref(getNewStateWithGameSettings());
let stopGameEngine: () => void = () => {};

onMounted(async () => {
	const { stop, restart, changeGameStatus } = await gameEngine.start((newState) => {
			gameState.value = newState;
			console.log(newState.status)
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
	stopGameEngine = stop;

	watch(gameSettings.value, restart);

	gameGraphics.start('previewCanvasDiv', theme.value, gameState, (ctx, screen) => {
		screenSize.value.width = screen.width;
		screenSize.value.height = screen.height;

		switch (gameState.value.status) {
			case gameStatusType.GAMEOVER:
				restart();
			case gameStatusType.ON_HOLD:
				changeGameStatus(gameStatusType.STARTED);
			case gameStatusType.STARTED:
				gameGraphics.drawGame(ctx, gameState.value, screen, theme.value);
		}
 	});
})

onBeforeRouteLeave(() => {
	stopGameEngine();
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
