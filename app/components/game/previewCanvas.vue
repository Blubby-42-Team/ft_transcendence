<script lang="ts" setup>
import { gameStatusType } from '#imports';

const props = defineProps({
	uniqueToken: {
		type: String,
		required: true,
	}
})

const { theme, gameSettings } = useGame2Store()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: any = {};

const engine = new GameEngine(gameSettings.value, (state) => {
		gameState = state;
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

const graphic = new GraphicEngine(props.uniqueToken, theme.value, () => gameState, (ctx, screen) => {
	screenSize.value.width = screen.width;
	screenSize.value.height = screen.height;

	switch (gameState.status) {
		case gameStatusType.GAMEOVER:
			engine.restart(gameSettings.value);
		case gameStatusType.ON_HOLD:
			engine.changeGameStatus(gameStatusType.STARTED);
		case gameStatusType.STARTED:
			graphic.drawGame(ctx);
	}
});

onMounted(async () => {
	engine.start()
	graphic.start();

	watch(gameSettings.value, () => engine.restart(gameSettings.value));
})

onUnmounted(() => {
	engine.stop();
	graphic.stop();
})

</script>

<template>
	<div :id="props.uniqueToken" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-pink-500" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
