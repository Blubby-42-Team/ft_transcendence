<script lang="ts" setup>
import { gameStatusType } from '#imports';

const props = defineProps({
	uniqueToken: {
		type: String,
		required: true,
	}
})

const settings = useState<gameSettingsType>('settings');
const theme = useState<gameTheme>('gameTheme');

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: any = {};

const engine = new GameEngine(settings.value, (state) => {
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
			engine.restart(settings.value);
		case gameStatusType.ON_HOLD:
			engine.changeGameStatus(gameStatusType.STARTED);
		case gameStatusType.STARTED:
			graphic.drawGame(ctx);
	}
});

onMounted(async () => {
	engine.start()
	graphic.start();

	const settings = useState<gameSettingsType>('settings');

	watch(settings.value, () => engine.restart(settings.value));
})

onUnmounted(() => {
	engine.stop();
	graphic.stop();
})

</script>

<template>
	<div :id="props.uniqueToken" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="border bg-text border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
