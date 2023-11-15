<script lang="ts" setup>
import { gameStatusType } from '#imports';

const { theme, gameSettings } = useGame2Store()

const screenSize = ref({
	width: 0,
	height: 0,
})

let gameState: gameStateType = {
	status:				gameStatusType.ON_HOLD,
	aispeed:			0.1,
	playerspeed:		0.5,
	gameArea:			{	center: {	x: 0,	y: 0,		},	height_d_2: 25,		width_d_2: 35,	},
	ball:				{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 1, direction: Math.PI / 4	},
	player_left:		{	center: {	x: -25,	y: 0,		},	height_d_2: 10,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_right:		{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_top:			{	active: false,	},
	player_bottom:		{	active: false,	},
	obstacles: {
		player2Bottom:	{	center: {	x: 0,	y: 26 ,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
		player2Top:		{	center: {	x: 0,	y: -26,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
		
	}
};

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

const graphic = new GraphicEngine('previewCanvasDiv', theme.value, () => gameState, (ctx, screen) => {
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

onBeforeRouteLeave(() => {
	engine.stop();
	graphic.stop();
})

</script>

<template>
	<div id="previewCanvasDiv" class="w-full h-full">
		
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
